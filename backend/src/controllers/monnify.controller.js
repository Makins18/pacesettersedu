import crypto from "crypto";
import axios from "axios";
import prisma from "../config/db.js";
import { generateInvoicePDF, generateTicketPDF } from "../utils/pdfGenerator.js";
import { sendEmail } from "../utils/emailService.js";

const MONNIFY_BASE_URL = process.env.MONNIFY_BASE_URL || "https://sandbox.monnify.com/api/v1";

const getMonnifyToken = async () => {
    try {
        const authString = Buffer.from(
            `${process.env.MONNIFY_API_KEY}:${process.env.MONNIFY_SECRET_KEY}`
        ).toString("base64");

        const response = await axios.post(
            `${MONNIFY_BASE_URL}/auth/login`,
            {},
            {
                headers: {
                    Authorization: `Basic ${authString}`,
                },
            }
        );

        return response.data.responseBody.accessToken;
    } catch (error) {
        console.error("Monnify Token Error:", error.response?.data || error.message);
        throw new Error("Failed to authenticate with Monnify");
    }
};

export const verifyMonnifyPayment = async (req, res) => {
    const { transactionReference, cartItems } = req.body;

    try {
        const token = await getMonnifyToken();
        const response = await axios.get(
            `${MONNIFY_BASE_URL}/merchant/transactions/query?transactionReference=${transactionReference}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const transaction = response.data.responseBody;

        if (transaction.paymentStatus === "PAID") {
            // Check if order already exists to avoid duplicates
            let order = await prisma.order.findUnique({
                where: { id: transactionReference }, // Assuming transactionReference is the ID or unique field
                include: { items: true }
            });

            // If not found by ID, try reference (if reference is used)
            if (!order) {
                order = await prisma.order.findFirst({
                    where: { reference: transactionReference },
                    include: { items: true }
                });
            }

            if (!order) {
                order = await prisma.order.create({
                    data: {
                        reference: transactionReference,
                        userEmail: transaction.customer.email,
                        totalAmount: parseFloat(transaction.amountPaid),
                        paymentStatus: 'paid',
                        paidAt: new Date(),
                        items: {
                            create: cartItems.map(item => ({
                                productType: item.type || 'book',
                                title: item.title,
                                price: parseFloat(item.price),
                                quantity: parseInt(item.quantity) || 1,
                                bookId: item.type === 'book' ? item.id : null,
                                eventId: item.type === 'event' ? item.id : null
                            }))
                        }
                    },
                    include: { items: true }
                });

                // Trigger Document Generation & Email
                try {
                    if (order.items.some(i => i.productType === "book")) {
                        const path = await generateInvoicePDF(order);
                        order = await prisma.order.update({
                            where: { id: order.id },
                            data: { invoiceUrl: `/api/download/invoice/${order.id}` },
                            include: { items: true }
                        });
                        await sendEmail(order.userEmail, path, "invoice");
                    }
                    if (order.items.some(i => i.productType === "event")) {
                        const path = await generateTicketPDF(order);
                        order = await prisma.order.update({
                            where: { id: order.id },
                            data: { ticketUrl: `/api/download/ticket/${order.id}` },
                            include: { items: true }
                        });
                        await sendEmail(order.userEmail, path, "ticket");
                    }
                    // Alert Admin
                    await sendEmail(process.env.ADMIN_EMAIL || process.env.EMAIL_USER, order, "admin_alert");
                } catch (err) {
                    console.error("Post-Payment Processing Error:", err);
                }
            }

            return res.status(200).json({ success: true, order, transaction });
        } else {
            return res.status(400).json({ success: false, message: "Payment not successful" });
        }
    } catch (error) {
        console.error("Monnify Verification Error:", error.response?.data || error.message);
        res.status(500).json({ message: "Server error during payment verification" });
    }
};

export const monnifyWebhook = async (req, res) => {
    const signature = req.headers["monnify-signature"];
    const requestBody = JSON.stringify(req.body);

    const computedSignature = crypto
        .createHmac("sha512", process.env.MONNIFY_SECRET_KEY)
        .update(requestBody)
        .digest("hex");

    if (signature !== computedSignature) {
        return res.status(401).send("Invalid Signature");
    }

    const { eventType, eventData } = req.body;

    if (eventType === "SUCCESSFUL_TRANSACTION") {
        try {
            // Idempotent update: Only update if not already paid
            const order = await prisma.order.update({
                where: { reference: eventData.transactionReference },
                data: {
                    paymentStatus: 'paid',
                    paidAt: new Date()
                },
                include: { items: true }
            });

            if (order) {
                // Trigger Document Generation & Email for Webhook success too
                if (order.items.some(i => i.productType === "book")) {
                    const path = await generateInvoicePDF(order);
                    await sendEmail(order.userEmail, path, "invoice");
                }
                if (order.items.some(i => i.productType === "event")) {
                    const path = await generateTicketPDF(order);
                    await sendEmail(order.userEmail, path, "ticket");
                }
                // Alert Admin via Webhook too
                await sendEmail(process.env.ADMIN_EMAIL || process.env.EMAIL_USER, order, "admin_alert");
            }
            console.log("Monnify Webhook: SUCCESS Saved & Processed", eventData.transactionReference);
        } catch (err) {
            console.error("Webhook Order Update Error:", err);
        }
    }

    res.status(200).send("OK");
};

export const getOrders = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            include: { items: true },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json(orders);
    } catch (error) {
        console.error("Failed to fetch orders:", error);
        res.status(500).json({ message: "Failed to fetch orders" });
    }
};

export const getStats = async (req, res) => {
    try {
        const totalSalesRes = await prisma.order.aggregate({
            where: { paymentStatus: 'paid' },
            _sum: { totalAmount: true }
        });

        const ordersCount = await prisma.order.count({
            where: { paymentStatus: 'paid' }
        });

        const bookCount = await prisma.book.count();
        const eventCount = await prisma.event.count();

        res.json({
            revenue: totalSalesRes._sum.totalAmount || 0,
            salesCount: ordersCount,
            books: bookCount,
            events: eventCount
        });
    } catch (error) {
        console.error("Failed to fetch stats:", error);
        res.status(500).json({ message: "Failed to fetch stats" });
    }
};

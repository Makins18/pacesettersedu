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
                timeout: 10000 // 10s timeout
            }
        );

        if (response.data && response.data.responseBody && response.data.responseBody.accessToken) {
            return response.data.responseBody.accessToken;
        }
        throw new Error("Invalid response structure from Monnify");
    } catch (error) {
        const errorData = error.response?.data || error.message;
        console.error("Monnify Token Error:", errorData);
        throw new Error(`Monnify Auth Failed: ${JSON.stringify(errorData)}`);
    }
};

export const verifyMonnifyPayment = async (req, res) => {
    const { transactionReference, cartItems } = req.body;

    console.log(`>>> Starting verification for reference: ${transactionReference}`);

    if (!transactionReference) {
        console.error("✗ Verification Error: Missing transactionReference in request body:", req.body);
        return res.status(400).json({
            success: false,
            message: "Transaction reference is required",
            receivedBody: req.body
        });
    }

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
        console.log(`>>> Monnify status: ${transaction.paymentStatus} for ref: ${transactionReference}`);

        if (transaction.paymentStatus === "PAID") {
            // Check if order already exists using the unique reference
            let order = await prisma.order.findUnique({
                where: { reference: transactionReference },
                include: { items: true }
            });

            if (!order) {
                console.log(">>> Creating new order in database...");
                // Map cartItems to OrderItem creation data
                const orderItemsData = cartItems.map(item => {
                    const data = {
                        productType: item.type || 'book',
                        title: item.title,
                        price: parseFloat(item.price) || 0,
                        quantity: parseInt(item.quantity) || 1,
                    };

                    // Handle IDs carefully (support both id and _id if frontend fluctuates)
                    const productId = item.id || item._id;
                    if (item.type === 'book') {
                        data.bookId = productId;
                    } else if (item.type === 'event') {
                        data.eventId = productId;
                    }
                    return data;
                });

                order = await prisma.order.create({
                    data: {
                        reference: transactionReference,
                        userEmail: transaction.customer.email,
                        totalAmount: parseFloat(transaction.amountPaid),
                        paymentStatus: 'paid',
                        paidAt: new Date(),
                        items: {
                            create: orderItemsData
                        }
                    },
                    include: { items: true }
                });

                console.log("✓ Order created successfully:", order.id);

                // Trigger Document Generation & Email
                try {
                    const hasBooks = order.items.some(i => i.productType === "book");
                    const hasEvents = order.items.some(i => i.productType === "event");

                    let updateData = {};

                    if (hasBooks) {
                        const path = await generateInvoicePDF(order);
                        updateData.invoiceUrl = `/api/download/invoice/${order.id}`;
                        await sendEmail(order.userEmail, path, "invoice");
                    }

                    if (hasEvents) {
                        const path = await generateTicketPDF(order);
                        updateData.ticketUrl = `/api/download/ticket/${order.id}`;
                        await sendEmail(order.userEmail, path, "ticket");
                    }

                    if (Object.keys(updateData).length > 0) {
                        order = await prisma.order.update({
                            where: { id: order.id },
                            data: updateData,
                            include: { items: true }
                        });
                    }

                    // Alert Admin
                    await sendEmail(process.env.ADMIN_EMAIL || process.env.EMAIL_USER, order, "admin_alert");
                } catch (err) {
                    console.error("✗ Post-Payment Processing Error:", err);
                }
            } else {
                console.log(">>> Order already exists for reference:", transactionReference);
            }

            return res.status(200).json({ success: true, order, transaction });
        } else {
            console.warn(`⚠ Transaction not paid. Status: ${transaction.paymentStatus}`);
            return res.status(400).json({
                success: false,
                message: `Transaction not paid. Status: ${transaction.paymentStatus}`,
                transaction
            });
        }
    } catch (error) {
        const errorMsg = error.response?.data || error.message;
        console.error("✗ Monnify Verification Error:", errorMsg);
        res.status(500).json({
            message: "Payment verification failed on server",
            error: errorMsg
        });
    }
};

export const monnifyWebhook = async (req, res) => {
    const signature = req.headers["monnify-signature"];
    const requestBody = JSON.stringify(req.body);

    if (!process.env.MONNIFY_SECRET_KEY) {
        console.error("Webhook Error: MONNIFY_SECRET_KEY missing");
        return res.status(500).send("Configuration Error");
    }

    const computedSignature = crypto
        .createHmac("sha512", process.env.MONNIFY_SECRET_KEY)
        .update(requestBody)
        .digest("hex");

    if (signature !== computedSignature) {
        console.warn("Invalid webhook signature received");
        return res.status(401).send("Invalid Signature");
    }

    const { eventType, eventData } = req.body;

    if (eventType === "SUCCESSFUL_TRANSACTION") {
        try {
            // Find or update the order
            let order = await prisma.order.findUnique({
                where: { reference: eventData.transactionReference },
                include: { items: true }
            });

            if (order && order.paymentStatus !== 'paid') {
                order = await prisma.order.update({
                    where: { id: order.id },
                    data: {
                        paymentStatus: 'paid',
                        paidAt: new Date()
                    },
                    include: { items: true }
                });

                // Trigger Document Generation & Email for Webhook success
                try {
                    if (order.items.some(i => i.productType === "book")) {
                        const path = await generateInvoicePDF(order);
                        await sendEmail(order.userEmail, path, "invoice");
                    }
                    if (order.items.some(i => i.productType === "event")) {
                        const path = await generateTicketPDF(order);
                        await sendEmail(order.userEmail, path, "ticket");
                    }
                    // Alert Admin via Webhook
                    await sendEmail(process.env.ADMIN_EMAIL || process.env.EMAIL_USER, order, "admin_alert");
                } catch (sendErr) {
                    console.error("Webhook post-processing error:", sendErr);
                }
            }
            console.log("Monnify Webhook: Transaction Processed", eventData.transactionReference);
        } catch (err) {
            console.error("Webhook Logic Error:", err);
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
export const createManualOrder = async (req, res) => {
    const { userEmail, totalAmount, items } = req.body;

    try {
        const order = await prisma.order.create({
            data: {
                reference: `MAN-${Date.now()}`,
                userEmail,
                totalAmount: parseFloat(totalAmount),
                paymentStatus: 'paid',
                paidAt: new Date(),
                items: {
                    create: items.map(item => ({
                        productType: item.type,
                        title: item.title,
                        price: parseFloat(item.price),
                        quantity: parseInt(item.quantity),
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
                await prisma.order.update({
                    where: { id: order.id },
                    data: { invoiceUrl: `/api/download/invoice/${order.id}` }
                });
                await sendEmail(order.userEmail, path, "invoice");
            }
            if (order.items.some(i => i.productType === "event")) {
                const path = await generateTicketPDF(order);
                await prisma.order.update({
                    where: { id: order.id },
                    data: { ticketUrl: `/api/download/ticket/${order.id}` }
                });
                await sendEmail(order.userEmail, path, "ticket");
            }
        } catch (err) {
            console.error("Manual Order Doc Gen Error:", err);
        }

        res.status(201).json({ success: true, order });
    } catch (error) {
        console.error("Manual Order Creation Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

// Ensure directories exist
const ensureDir = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

export const generateInvoicePDF = (order) => {
    return new Promise((resolve, reject) => {
        try {
            ensureDir("invoices");
            const doc = new PDFDocument({ margin: 50 });
            const filePath = path.resolve(`invoices/invoice-${order.id}.pdf`);
            const stream = fs.createWriteStream(filePath);

            doc.pipe(stream);

            // --- Header & Branding ---
            doc.fillColor("#1e40af").fontSize(26).text("PACESETTERS", { align: "right" });
            doc.fontSize(10).fillColor("#4b5563").text("Phonics and Diction Institute", { align: "right" });
            doc.text("Lagos, Nigeria | +234 812 345 6789", { align: "right" });
            doc.moveDown(2);

            // --- Title & Metadata ---
            doc.fillColor("#1e40af").fontSize(30).text("OFFICIAL RECEIPT", 50, 50);
            doc.fontSize(10).fillColor("#6b7280").text(`Transaction Ref: ${order.reference || order.id.slice(0, 10)}`, 50, 85);
            doc.text(`Date Issued: ${new Date().toLocaleDateString()}`, 50, 100);
            doc.moveDown(4);

            // --- Customer Info ---
            doc.fillColor("#111827").fontSize(12).text("CUSTOMER DETAILS:", 50, 160);
            doc.fontSize(11).fillColor("#374151").text(`Email: ${order.userEmail}`, 50, 180);
            doc.moveDown(3);

            // --- Table Header ---
            const tableTop = 240;
            doc.rect(50, tableTop, 500, 30).fill("#1e40af");
            doc.fillColor("white").fontSize(10).text("ITEM DESCRIPTION", 60, tableTop + 10);
            doc.text("QTY", 350, tableTop + 10, { width: 40, align: "center" });
            doc.text("UNIT PRICE", 400, tableTop + 10, { width: 70, align: "right" });
            doc.text("TOTAL", 480, tableTop + 10, { width: 60, align: "right" });

            // --- Items ---
            let currentY = tableTop + 40;
            order.items.forEach(item => {
                doc.fillColor("#374151").text(item.title, 60, currentY, { width: 280 });
                doc.text(item.quantity.toString(), 350, currentY, { width: 40, align: "center" });
                doc.text(`N${item.price.toLocaleString()}`, 400, currentY, { width: 70, align: "right" });
                doc.text(`N${(item.price * item.quantity).toLocaleString()}`, 480, currentY, { width: 60, align: "right" });
                currentY += 30;
            });

            // --- Footer Total ---
            doc.rect(340, currentY + 10, 210, 45).fill("#f9fafb");
            doc.rect(340, currentY + 10, 210, 45).stroke("#e5e7eb");
            doc.fillColor("#111827").fontSize(12).text("AMOUNT PAID", 350, currentY + 25);
            doc.fillColor("#1e40af").fontSize(14).text(`N${order.totalAmount.toLocaleString()}`, 450, currentY + 25, { align: "right", width: 90 });

            // --- Note ---
            doc.fillColor("#9ca3af").fontSize(10)
                .text("Thank you for your business. This document serves as proof of payment.", 50, 720, { align: "center", width: 500 });

            doc.end();
            stream.on('finish', () => resolve(filePath));
        } catch (err) {
            reject(err);
        }
    });
};

export const generateTicketPDF = (order) => {
    return new Promise((resolve, reject) => {
        try {
            ensureDir("tickets");
            const doc = new PDFDocument({ size: [600, 320], margin: 0 });
            const filePath = path.resolve(`tickets/ticket-${order.id}.pdf`);
            const stream = fs.createWriteStream(filePath);

            doc.pipe(stream);

            // Primary Background
            doc.rect(0, 0, 600, 320).fill("#1e40af");

            // Modern Accents
            doc.opacity(0.15).circle(600, 0, 180).fill("white");
            doc.circle(0, 320, 120).fill("white");
            doc.opacity(1);

            // Ticket Border
            doc.rect(20, 20, 560, 280).lineWidth(3).stroke("white");

            // Header
            doc.fillColor("white").fontSize(28).text("ENTRY PASS", 50, 60);
            doc.fontSize(12).text("PACESETTERS PHONICS & DICTION INSTITUTE", 50, 95);

            // Content Divider
            doc.rect(50, 125, 500, 2).fill("white");

            // Event Details
            const ticketItem = order.items.find(i => i.productType === "event") || order.items[0];
            doc.fontSize(20).text(ticketItem.title, 50, 150, { width: 350 });

            doc.fontSize(11).text(`ATTENDEE: ${order.userEmail}`, 50, 210);
            doc.text(`TICKET NO: ${order.id.slice(0, 12).toUpperCase()}`, 50, 230);
            doc.text(`ISSUE DATE: ${new Date().toLocaleDateString()}`, 50, 250);

            // Status Badge
            doc.rect(430, 180, 120, 50).fill("white");
            doc.fillColor("#1e40af").fontSize(16).text("PAID/VALID", 440, 197, { width: 100, align: "center" });

            doc.end();
            stream.on('finish', () => resolve(filePath));
        } catch (err) {
            reject(err);
        }
    });
};

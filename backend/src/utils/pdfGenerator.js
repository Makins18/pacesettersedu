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
            doc.fillColor("#444444").fontSize(20).text("PACESETTERS", { align: "right" });
            doc.fontSize(10).text("Phonics and Diction Institute", { align: "right" });
            doc.text("Lagos, Nigeria", { align: "right" });
            doc.moveDown();

            // --- Title ---
            doc.fillColor("#2563eb").fontSize(28).text("INVOICE", 50, 50);
            doc.fillColor("#444444").fontSize(10).text(`Number: INV-${order.reference?.split('-')[1] || order.id.slice(0, 8)}`, 50, 85);
            doc.text(`Date: ${new Date().toLocaleDateString()}`, 50, 100);
            doc.moveDown();

            // --- Billing Info ---
            doc.fontSize(12).font("Helvetica-Bold").text("Billed To:", 50, 130);
            doc.font("Helvetica").fontSize(10).text(order.userEmail || "Customer", 50, 145);
            doc.moveDown();

            // --- Table Header ---
            const tableTop = 180;
            doc.font("Helvetica-Bold");
            doc.text("Item Description", 50, tableTop);
            doc.text("Qty", 300, tableTop, { width: 50, align: "center" });
            doc.text("Price", 350, tableTop, { width: 100, align: "right" });
            doc.text("Total", 450, tableTop, { width: 100, align: "right" });

            doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();
            doc.font("Helvetica").moveDown();

            // --- Table Content ---
            let y = tableTop + 25;
            order.items.forEach(item => {
                const subtotal = (item.price * item.quantity).toLocaleString();
                doc.text(item.title, 50, y);
                doc.text(item.quantity.toString(), 300, y, { width: 50, align: "center" });
                doc.text(`N${item.price.toLocaleString()}`, 350, y, { width: 100, align: "right" });
                doc.text(`N${subtotal}`, 450, y, { width: 100, align: "right" });
                y += 20;
            });

            // --- Footer / Totals ---
            doc.moveTo(350, y + 10).lineTo(550, y + 10).stroke();
            doc.fontSize(12).font("Helvetica-Bold").text("TOTAL AMOUNT:", 350, y + 20);
            doc.text(`N${order.totalAmount.toLocaleString()}`, 450, y + 20, { width: 100, align: "right" });

            doc.fontSize(10).font("Helvetica-Oblique").text("This is an electronically generated proof of purchase.", 50, y + 60, { align: "center" });

            doc.end();
            stream.on('finish', () => resolve(filePath));
            stream.on('error', (err) => reject(err));
        } catch (err) {
            reject(err);
        }
    });
};

export const generateTicketPDF = (order) => {
    return new Promise((resolve, reject) => {
        try {
            ensureDir("tickets");
            const doc = new PDFDocument({ size: [400, 250], margin: 20 });
            const filePath = path.resolve(`tickets/ticket-${order.id}.pdf`);
            const stream = fs.createWriteStream(filePath);

            doc.pipe(stream);

            // Background color
            doc.rect(0, 0, 400, 250).fill("#2563eb");

            // Ticket Outer Border
            doc.rect(10, 10, 380, 230).strokeColor("white").lineWidth(2).stroke();

            // Content
            doc.fillColor("white").fontSize(10).text("EVENT ENTRY PASS", 20, 30);
            doc.fontSize(18).font("Helvetica-Bold").text("PACESETTERS", 20, 50);
            doc.fontSize(8).font("Helvetica").text("Diction & Phonics Institute", 20, 70);

            doc.moveTo(20, 90).lineTo(380, 90).stroke();

            order.items.forEach(item => {
                if (item.productType === "event") {
                    doc.fontSize(14).font("Helvetica-Bold").text(item.title, 20, 110);
                }
            });

            doc.fontSize(10).font("Helvetica").text(`Admit One: ${order.userEmail}`, 20, 150);
            doc.text(`Ref: ${order.reference}`, 20, 165);
            doc.text(`Date Issued: ${new Date().toDateString()}`, 20, 180);

            doc.fontSize(12).font("Helvetica-Bold").text("CONFIRMED", 280, 200, { align: "right" });

            doc.end();
            stream.on('finish', () => resolve(filePath));
            stream.on('error', (err) => reject(err));
        } catch (err) {
            reject(err);
        }
    });
};

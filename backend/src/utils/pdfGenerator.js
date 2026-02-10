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
            const doc = new PDFDocument();
            const filePath = path.resolve(`invoices/invoice-${order.id}.pdf`);
            const stream = fs.createWriteStream(filePath);

            doc.pipe(stream);

            doc.fontSize(20).text("Pacesetters Phonics and Diction Institute");
            doc.text("BOOK PURCHASE INVOICE\n");

            order.items.forEach(item => {
                if (item.productType === "book") {
                    doc.text(`${item.title} x${item.quantity} = ₦${item.price * item.quantity}`);
                }
            });

            doc.text(`\nTOTAL: ₦${order.totalAmount}`);
            doc.text(`Invoice ID: ${order.id}`);
            doc.text(`Date: ${new Date().toLocaleDateString()}`);

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
            const doc = new PDFDocument();
            const filePath = path.resolve(`tickets/ticket-${order.id}.pdf`);
            const stream = fs.createWriteStream(filePath);

            doc.pipe(stream);

            doc.fontSize(20).text("EVENT TICKET");
            doc.text("Pacesetters Phonics and Diction Institute\n");

            order.items.forEach(item => {
                if (item.productType === "event") {
                    doc.text(`Event: ${item.title}`);
                }
            });

            doc.text(`Ticket ID: ${order.id}`);
            doc.text(`Status: CONFIRMED`);

            doc.end();
            stream.on('finish', () => resolve(filePath));
            stream.on('error', (err) => reject(err));
        } catch (err) {
            reject(err);
        }
    });
};

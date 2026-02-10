import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

// Ensure directory exists
const ensureDirectoryExistence = (filePath) => {
    const dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return true;
    }
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
};

export const generateInvoice = async (order) => {
    const doc = new PDFDocument();
    const fileName = `invoice-${order._id}.pdf`;
    const filePath = path.join(process.cwd(), "invoices", fileName);

    ensureDirectoryExistence(filePath);

    doc.pipe(fs.createWriteStream(filePath));

    doc.fontSize(20).text("Pacesetters Phonics and Diction Institute", { align: "center" });
    doc.moveDown();

    doc.fontSize(12).text(`Invoice ID: ${order._id}`);

    // Handle optional fields safely
    if (order.userEmail) doc.text(`Email: ${order.userEmail}`);
    if (order.totalAmount) doc.text(`Total Paid: N${order.totalAmount}`);

    doc.moveDown();

    if (order.items && Array.isArray(order.items)) {
        order.items.forEach(item => {
            const price = item.price || 0;
            const quantity = item.quantity || 1;
            doc.text(`${item.name || 'Item'} x ${quantity} - N${price * quantity}`);
        });
    }

    doc.end();

    order.invoiceUrl = `/api/download/invoice/${order._id}`;
    await order.save();
};

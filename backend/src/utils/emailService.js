import nodemailer from "nodemailer";

export const sendEmail = async (to, filePath, type) => {
    // Only try to send if credentials are present, otherwise log
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log("Email credentials missing. Skipping email send.");
        console.log(`To: ${to}, Type: ${type}, File: ${filePath}`);
        return;
    }

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    let subject = type === "invoice" ? "Your Purchase Invoice" : "Your Event Ticket";
    let text = "Thank you for your payment.";

    if (type === "admin_alert") {
        subject = "🚀 NEW ORDER RECEIVED - Pacesetters";
        const order = filePath; // Pass whole order object for admin alert
        text = `
            NEW ORDER RECEIVED!
            -------------------
            Reference: ${order.reference}
            Customer: ${order.userEmail}
            Amount: N${order.totalAmount}
            Items: ${order.items?.map(i => `${i.title} (x${i.quantity})`).join(", ")}
            Date: ${new Date().toLocaleString()}
        `;
    }

    await transporter.sendMail({
        from: `"Pacesetters Notifications" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
        attachments: type !== "admin_alert" ? [{ path: filePath }] : []
    });
};

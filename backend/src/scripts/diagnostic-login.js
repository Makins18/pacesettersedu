import bcrypt from "bcryptjs";
import prisma from "../config/db.js";
import dotenv from "dotenv";
dotenv.config();

async function checkPassword() {
    const email = "pacesetterspdieweb@gmail.com";
    const plainPassword = "paceWebsetters.Edu16";

    console.log(`🔍 Checking credentials for ${email}...`);
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            console.error("❌ User not found in database!");
            return;
        }

        const isMatch = await bcrypt.compare(plainPassword, user.password);
        if (isMatch) {
            console.log("✅ Password MATCHES (bcrypt verified).");
        } else {
            console.error("❌ Password DOES NOT match!");
        }
    } catch (err) {
        console.error("error:", err);
    } finally {
        await prisma.$disconnect();
    }
}

checkPassword();

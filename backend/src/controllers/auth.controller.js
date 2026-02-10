import bcrypt from "bcryptjs";
import prisma from "../config/db.js";
import { generateToken } from "../utils/auth.js";

export const loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(401).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        if (user.role !== 'admin') return res.status(403).json({ message: "Access denied" });

        res.json({
            token: generateToken(user.id, user.role),
            admin: {
                id: user.id,
                email: user.email,
                role: user.role
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

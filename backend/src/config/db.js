import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const connectDB = async () => {
    try {
        await prisma.$connect();
        console.log("✓ SQLite (Prisma) connected");
    } catch (error) {
        console.error("✗ Prisma connection error:", error.message);
    }
};

export default prisma;

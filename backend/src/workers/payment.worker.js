import { Worker } from "bullmq";
import { isRedisAvailable } from "../config/redis.js";
import { generateInvoicePDF } from "../utils/pdfGenerator.js";
import prisma from "../config/db.js";

let worker = null;

// Only start worker if Redis is available
if (isRedisAvailable()) {
    worker = new Worker("payments", async job => {
        console.log(`Processing payment job ${job.id} for order ${job.data.orderId}`);
        try {
            const { orderId } = job.data;

            // Fetch the full order from database using Prisma
            const order = await prisma.order.findUnique({
                where: { id: orderId },
                include: { items: true }
            });

            if (!order) {
                throw new Error(`Order ${orderId} not found`);
            }

            // Generate invoice with full order data
            await generateInvoicePDF(order);

            console.log(`✓ Invoice generated for order ${orderId}`);
            return { success: true, orderId };
        } catch (error) {
            console.error(`✗ Failed to process payment job ${job.id}:`, error);
            throw error; // Re-throw to mark job as failed
        }
    }, {
        connection: {
            host: process.env.REDIS_HOST || "localhost",
            port: process.env.REDIS_PORT || 6379
        }
    });

    worker.on("completed", job => {
        console.log(`✓ Job ${job.id} completed successfully`);
    });

    worker.on("failed", (job, err) => {
        console.error(`✗ Job ${job?.id} failed:`, err.message);
    });

    console.log("✓ Payment worker started");
} else {
    console.warn("⚠ Payment worker not started - Redis unavailable");
}

export default worker;

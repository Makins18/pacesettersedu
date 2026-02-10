import { Queue } from "bullmq";
import { isRedisAvailable } from "../config/redis.js";

let paymentQueue = null;

// Only create queue if Redis is available
const getPaymentQueue = () => {
    if (!isRedisAvailable()) {
        console.warn("⚠ Payment queue unavailable - Redis not connected");
        return null;
    }

    if (!paymentQueue) {
        paymentQueue = new Queue("payments", {
            connection: {
                host: process.env.REDIS_HOST || "localhost",
                port: process.env.REDIS_PORT || 6379,
            }
        });
    }

    return paymentQueue;
};

export { getPaymentQueue };

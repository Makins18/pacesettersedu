import Redis from "ioredis";

// Track Redis connection status
let isRedisConnected = false;

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
        if (times > 3) {
            console.warn("Redis connection failed after 3 retries. Running without Redis.");
            return null; // Stop retrying
        }
        const delay = Math.min(times * 50, 2000);
        return delay;
    },
    lazyConnect: true, // Don't connect immediately
});

redis.on("connect", () => {
    isRedisConnected = true;
    console.log("✓ Redis connected successfully");
});

redis.on("error", (err) => {
    isRedisConnected = false;
    console.warn("⚠ Redis connection error. Caching and queues disabled.", err.message);
});

redis.on("close", () => {
    isRedisConnected = false;
    console.warn("⚠ Redis connection closed");
});

// Attempt to connect
redis.connect().catch((err) => {
    console.warn("⚠ Redis unavailable. Running without caching:", err.message);
});

// Helper function to check if Redis is available
export const isRedisAvailable = () => isRedisConnected;

export default redis;

import prisma from "../config/db.js";
import redis, { isRedisAvailable } from "../config/redis.js";

export const getEvents = async (req, res) => {
    try {
        // Only use cache if Redis is available
        if (isRedisAvailable()) {
            const cached = await redis.get("events");
            if (cached) {
                console.log("Serving events from Redis cache");
                return res.json(JSON.parse(cached));
            }
        }

        // Fetch from DB
        const events = await prisma.event.findMany({ orderBy: { createdAt: 'desc' } });

        // Cache for 60 seconds if Redis is available
        if (isRedisAvailable()) {
            await redis.set("events", JSON.stringify(events), "EX", 60).catch(() => { });
        }

        res.json(events);
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

export const createEvent = async (req, res) => {
    try {
        const data = { ...req.body };
        if (data.price) data.price = parseFloat(data.price);
        if (data.capacity) data.capacity = parseInt(data.capacity);
        if (data.date) data.date = new Date(data.date);

        const event = await prisma.event.create({ data });

        // Invalidate cache if Redis is available
        if (isRedisAvailable()) {
            await redis.del("events").catch(() => { });
        }

        res.status(201).json(event);
    } catch (error) {
        console.error("Error creating event:", error);
        res.status(500).json({ message: "Error creating event" });
    }
};

export const updateEvent = async (req, res) => {
    try {
        const data = { ...req.body };
        if (data.price) data.price = parseFloat(data.price);
        if (data.capacity) data.capacity = parseInt(data.capacity);
        if (data.date) data.date = new Date(data.date);

        // Remove system fields
        delete data.id;
        delete data.createdAt;
        delete data.updatedAt;

        const event = await prisma.event.update({
            where: { id: req.params.id },
            data
        });

        // Invalidate cache if Redis is available
        if (isRedisAvailable()) {
            await redis.del("events").catch(() => { });
        }

        res.json(event);
    } catch (error) {
        console.error("Error updating event:", error);
        res.status(500).json({ message: "Error updating event" });
    }
};

export const deleteEvent = async (req, res) => {
    try {
        await prisma.event.delete({ where: { id: req.params.id } });

        // Invalidate cache if Redis is available
        if (isRedisAvailable()) {
            await redis.del("events").catch(() => { });
        }

        res.json({ message: "Event deleted" });
    } catch (error) {
        console.error("Error deleting event:", error);
        res.status(500).json({ message: "Error deleting event" });
    }
};

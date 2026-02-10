import prisma from "../config/db.js";
import redis, { isRedisAvailable } from "../config/redis.js";

export const getBooks = async (req, res) => {
    try {
        // Only use cache if Redis is available
        if (isRedisAvailable()) {
            const cached = await redis.get("books");
            if (cached) {
                // Background revalidation (Stale-While-Revalidate pattern)
                prisma.book.findMany({ orderBy: { createdAt: 'desc' } }).then(books => {
                    redis.set("books", JSON.stringify(books), "EX", 300).catch(() => { });
                }).catch(() => { });
                return res.json(JSON.parse(cached));
            }
        }

        const books = await prisma.book.findMany({ orderBy: { createdAt: 'desc' } });

        // Cache if Redis is available
        if (isRedisAvailable()) {
            await redis.set("books", JSON.stringify(books), "EX", 300).catch(() => { });
        }

        res.json(books);
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).json({ message: "Error fetching books" });
    }
};

export const createBook = async (req, res) => {
    try {
        // Convert price/stock to numbers if strings (safety check)
        const data = { ...req.body };
        if (data.price) data.price = parseFloat(data.price);
        if (data.stock) data.stock = parseInt(data.stock);

        const book = await prisma.book.create({ data });

        // Invalidate cache if Redis is available
        if (isRedisAvailable()) {
            await redis.del("books").catch(() => { });
        }

        res.status(201).json(book);
    } catch (error) {
        console.error("Error creating book:", error);
        res.status(500).json({ message: "Error creating book" });
    }
};

export const updateBook = async (req, res) => {
    try {
        const data = { ...req.body };
        if (data.price) data.price = parseFloat(data.price);
        if (data.stock) data.stock = parseInt(data.stock);

        // Remove system fields to avoid Prisma errors
        delete data.id;
        delete data.createdAt;
        delete data.updatedAt;

        const book = await prisma.book.update({
            where: { id: req.params.id },
            data
        });

        // Invalidate cache if Redis is available
        if (isRedisAvailable()) {
            await redis.del("books").catch(() => { });
        }

        res.json(book);
    } catch (error) {
        console.error("Error updating book:", error);
        res.status(500).json({ message: "Error updating book" });
    }
};

export const deleteBook = async (req, res) => {
    try {
        await prisma.book.delete({ where: { id: req.params.id } });

        // Invalidate cache if Redis is available
        if (isRedisAvailable()) {
            await redis.del("books").catch(() => { });
        }

        res.json({ message: "Book deleted" });
    } catch (error) {
        console.error("Error deleting book:", error);
        res.status(500).json({ message: "Error deleting book" });
    }
};

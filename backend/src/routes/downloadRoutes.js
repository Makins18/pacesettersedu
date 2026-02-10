import express from "express";
import prisma from "../config/db.js";
import path from "path";
import fs from "fs";

const router = express.Router();

router.get("/invoice/:id", async (req, res) => {
    try {
        const order = await prisma.order.findUnique({
            where: { id: req.params.id }
        });
        if (!order || !order.invoiceUrl) return res.sendStatus(404);

        const filePath = path.resolve(`invoices/invoice-${order.id}.pdf`);
        if (fs.existsSync(filePath)) {
            res.download(filePath);
        } else {
            res.status(404).send("File not found on server");
        }
    } catch (e) {
        console.error(e);
        res.status(500).send("Error");
    }
});

router.get("/ticket/:id", async (req, res) => {
    try {
        const order = await prisma.order.findUnique({
            where: { id: req.params.id }
        });
        if (!order || !order.ticketUrl) return res.sendStatus(404);

        const filePath = path.resolve(`tickets/ticket-${order.id}.pdf`);
        if (fs.existsSync(filePath)) {
            res.download(filePath);
        } else {
            res.status(404).send("File not found on server");
        }
    } catch (e) {
        console.error(e);
        res.status(500).send("Error");
    }
});

export default router;

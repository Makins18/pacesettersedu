import express from "express";
import { verifyMonnifyPayment, monnifyWebhook, getOrders, getStats, createManualOrder } from "../controllers/monnify.controller.js";

const router = express.Router();

router.get("/orders", getOrders);
router.get("/stats", getStats);
router.post("/verify", verifyMonnifyPayment);
router.post("/webhook", monnifyWebhook);
router.post("/manual", createManualOrder);

export default router;

import express from "express";
import { getEvents, createEvent, updateEvent, deleteEvent } from "../controllers/event.controller.js";
import { protectAdmin } from "../utils/auth.js";

const router = express.Router();

router.get("/", getEvents);
router.post("/", protectAdmin, createEvent);
router.put("/:id", protectAdmin, updateEvent);
router.delete("/:id", protectAdmin, deleteEvent);

export default router;

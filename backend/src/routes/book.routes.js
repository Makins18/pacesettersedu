import express from "express";
import { getBooks, createBook, updateBook, deleteBook } from "../controllers/book.controller.js";
import { protectAdmin } from "../utils/auth.js";

const router = express.Router();

router.get("/", getBooks);
router.post("/", protectAdmin, createBook);
router.put("/:id", protectAdmin, updateBook);
router.delete("/:id", protectAdmin, deleteBook);

export default router;

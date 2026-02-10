import express from 'express';
import { upload, uploadFile } from '../controllers/upload.controller.js';
import { protectAdmin } from '../utils/auth.js';

const router = express.Router();

// Support single file uploads for books/events
router.post('/', protectAdmin, upload.single('file'), uploadFile);

export default router;

import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth.routes.js";
import downloadRoutes from "./routes/downloadRoutes.js";
import eventRoutes from "./routes/event.routes.js";
import bookRoutes from "./routes/book.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import monnifyRoutes from "./routes/monnify.routes.js";
import { audit } from "./middleware/audit.js";

const app = express();
app.use(compression());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use("/api", apiLimiter);

app.get("/", (req, res) => {
  res.send("PPDI API running");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/download", downloadRoutes);
app.use("/api/monnify", monnifyRoutes);

export default app;

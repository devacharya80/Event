import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN?.split(",") ?? "*" }));
app.use(express.json({ limit: "10kb" }));
if (process.env.NODE_ENV !== "test") app.use(morgan("dev"));

app.use(
  "/api",
  rateLimit({ windowMs: 15 * 60 * 1000, limit: 100, standardHeaders: true, legacyHeaders: false })
);

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

// requirement routes get mounted here in a later step

app.use(notFound);
app.use(errorHandler);

export default app;
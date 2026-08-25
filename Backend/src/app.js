import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import adminRoutes from "./routes/admin.route.js";
import requestRoutes from "./routes/request.route.js";

const app = express();
const isProduction = process.env.NODE_ENV === "production";

// Needed so the "secure" cookie flag and req.secure work correctly behind
// Vercel's reverse proxy in production.
if (isProduction) app.set("trust proxy", 1);

const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim());

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(compression());
app.use(express.json({ limit: "10mb" })); // room for small inline images before they're uploaded to Cloudinary
app.use(cookieParser());
app.use(
  cors({
    origin: (origin, callback) => {
      // same-origin requests (frontend + /api on the same Vercel domain)
      // don't send an Origin header the browser needs checked, and non-browser
      // tools (curl/Postman) send none either — allow both.
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// basic brute-force protection on auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many attempts, please try again later" },
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/requests", requestRoutes);

app.use("/api", (_req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// centralized error handler — keeps stack traces out of client responses in prod
app.use((err, _req, res, _next) => {
  console.error(err.stack || err.message);
  const status = err.status || 500;
  res.status(status).json({
    message: isProduction ? "Internal server error" : err.message,
  });
});

export default app;

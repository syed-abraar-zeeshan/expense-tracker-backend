require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const createError = require("http-errors");

const connectDB = require("./config/db");
const logger = require("./config/logger");
const errorHandler = require("./middleware/errorMiddleware");

// Validate Environment Variables
if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is missing in .env");
}

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is missing in .env");
}

// Connect Database
connectDB();

// Initialize Express App
const app = express();

app.set("trust proxy", 1);

/**
 * Security Middleware
 */
app.use(cors());
app.use(helmet());

/**
 * Logging
 */
app.use(morgan("dev"));

/**
 * Body Parsers
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Prevent MongoDB Operator Injection
 */
// app.use(mongoSanitize());

/**
 * Rate Limiting
 */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minutes
  max: 100, // Max 100 requests per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

app.use(limiter);

/**
 * Health Check Route
 */
app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Expense Tracker API is running!",
  });
});

/**
 * API Routes
 */
app.use("/api/auth", require("./routes/auth"));
app.use("/api/expenses", require("./routes/expenses"));
app.use("/api/categories", require("./routes/categories"));
app.use("/api/dashboard", require("./routes/dashboard"));

/**
 * Handle Unknown Routes
 */
app.use((req, res, next) => {
  next(createError(404, "Route not found"));
});

/**
 * Global Error Handler
 * Must be the last middleware
 */
app.use(errorHandler);

/**
 * Start Server
 */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDB = require("./config/db");
const logger = require("./config/logger");

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 Expense Tracker API is running!",
  });
});

// Routes (we'll uncomment these once we have the route files set up)
app.use("/api/auth", require("./routes/auth"));
app.use("/api/expenses", require("./routes/expenses"));
app.use("/api/categories", require("./routes/categories"));
app.use("/api/dashboard", require("./routes/dashboard"));

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "❌ Route not found",
  });
});

//Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.success(`Server running on port ${PORT}`);
});

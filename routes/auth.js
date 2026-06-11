const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: "Too many attempts. Try again later." },
});

const {
  register,
  login,
  getProfile,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");

// Public routes
router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/forgot-password", authLimiter, forgotPassword);
router.put("/reset-password/:token", resetPassword);

// Private routes (protected)
router.get("/profile", protect, getProfile);

module.exports = router;

const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getProfile,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);

// Private routes (protected)
router.get("/profile", protect, getProfile);

module.exports = router;

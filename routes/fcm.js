const express = require("express");
const protect = require("../middleware/authMiddleware");

const {
  registerToken,
  sendNotification,
} = require("../controllers/fcmController");

const router = express.Router();

// @route   POST /api/fcm/register
// @desc    Register FCM token
// @access  Private
router.post("/register", protect, registerToken); // Register FCM Token

// @route   POST /api/fcm/send
// @desc    Send FCM notification
// @access  Private
router.post("/send", protect, sendNotification); // Send Notification

module.exports = router;

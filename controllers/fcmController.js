const logger = require("../config/logger");
const User = require("../models/User");
const createError = require("http-errors");
const messaging = require("../config/firebaseAdmin");

// @desc    Register FCM token
// @route   POST /api/fcm/register
// @access  Private

//saves the FCM token in MongoDB.
const registerToken = async (req, res) => {
  const { fcmToken } = req.body;

  if (!fcmToken) {
    throw createError(400, "FCM token is required");
  }

  await User.findByIdAndUpdate(req.user.id, { fcmToken }, { new: true });

  logger.info(`FCM token updated for user: ${req.user.email}`);

  return res.status(200).json({
    success: true,
    message: "FCM token registered successfully",
  });
};

const sendNotification = async (req, res) => {
  const fcmToken = req.user.fcmToken;

  if (!fcmToken) {
    throw createError(400, "FCM token is required to send notification");
  }

  // Create a notification message
  const message = {
    notification: {
      title: "Expense Tracker",
      body: "Your first notification from Expense Tracker!",
    },
    token: fcmToken, // The FCM token of the device to which you want to send the notification
  };
  const messageId = await messaging.send(message);

  logger.info(
    `Notification sent successfully to ${req.user.email}: ${messageId}`,
  );

  res.status(200).json({
    success: true,
    message: "Notification sent successfully",
    messageId,
  });
};

module.exports = { registerToken, sendNotification };

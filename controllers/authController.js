const jwt = require("jsonwebtoken");
const User = require("../models/User");
const logger = require("../config/logger");
const createError = require("http-errors");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const sanitize = require("../utils/sanitize");

const {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} = require("../validators/authValidator");

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  sanitize(req.body);
  registerSchema.parse(req.body);
  const { name, email, password } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw createError(400, "User already exists");
  }

  // Create new user
  const user = await User.create({ name, email, password });

  logger.info(`New user registered: ${user.email}`);
  return res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  sanitize(req.body);
  loginSchema.parse(req.body);
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email });

  // Check user & password match
  if (!user || !(await user.matchPassword(password))) {
    throw createError(401, "Invalid email or password");
  }

  logger.info(`User logged in: ${user.email}`);

  return res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user.id),
    },
  });
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) throw createError(404, "User not found");

  return res.status(200).json({
    success: true,
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
};

// @desc    Forgot Password - Generate Token & Send Email
// @route   POST /api/auth/forgot-password
// @access  Public

const forgotPassword = async (req, res) => {
  sanitize(req.body);
  forgotPasswordSchema.parse(req.body);

  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(200).json({
      success: true,
      message: "If this email exists, a reset link has been sent",
    });
  }

  // Generate token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Store hashed token
  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  await user.save();

  const resetUrl = `http://13.201.134.28:4000/api/auth/reset-password/${resetToken}`;

  await sendEmail({
    email: user.email,
    subject: "Password Reset",
    message: `Reset your password using this link:\n\n${resetUrl}\n\nThis link expires in 15 minutes.`,
  });

  return res.status(200).json({
    success: true,
    message: "Password reset email sent",
  });
};

const resetPassword = async (req, res) => {
  sanitize(req.body);
  resetPasswordSchema.parse(req.body);

  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw createError(400, "Invalid or expired token");
  }

  user.password = req.body.password;

  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  logger.info(`Password reset successful: ${user.email}`);

  return res.status(200).json({
    success: true,
    message: "Password reset successful",
  });
};
module.exports = { register, login, getProfile, forgotPassword, resetPassword };

const jwt = require("jsonwebtoken");
const User = require("../models/User");
const logger = require("../config/logger");
const createError = require("http-errors");

const protect = async (req, res, next) => {
  let token;

  // Check if token exists in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // If no token found
  if (!token) {
    logger.warn("Access denied - No token provided");
    throw createError(401, "Not authorized, no token");
  }

  // Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // Get user from token
  req.user = await User.findById(decoded.id).select("-password");
  if (!req.user) throw createError(401, "User not found");

  logger.info(`User authorized: ${req.user.email}`);
  next();
};

module.exports = protect;

// Every protected API request:
//         ↓
// Check Authorization header
//         ↓
//    Has token?
//   ┌────┴────┐
//   NO       YES
//   ↓         ↓
// Return    Verify token
// 401       with JWT_SECRET
// Error         ↓
//          Valid token?
//         ┌────┴────┐
//         NO       YES
//         ↓         ↓
//       Return    Get user
//       401       from DB
//       Error         ↓
//                Allow access
//                next()

// How Token Works:
// Step 1 → User logs in
// Step 2 → Server creates token:
//          "Bearer eyJhbGc..."
// Step 3 → Flutter stores token
// Step 4 → Every request sends token:
//          Authorization: Bearer eyJhbGc...
// Step 5 → Middleware checks token

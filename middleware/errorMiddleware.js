const { ZodError } = require("zod");

const errorHandler = (error, req, res, next) => {
  // Zod Validation Errors
  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  const statusCode = error.status || error.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    message: error.message || "Internal Server Error",
  });
};

module.exports = errorHandler;

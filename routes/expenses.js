const express = require("express");
const router = express.Router();

const {
  createExpense,
  getExpenses,
} = require("../controllers/expenseController");
const protect = require("../middleware/authMiddleware");

// @route POST api/expenses
router.post("/", protect, createExpense);

// @route GET api/expenses
router.get("/", protect, getExpenses);

module.exports = router;

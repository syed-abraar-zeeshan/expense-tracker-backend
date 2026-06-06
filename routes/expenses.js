const express = require("express");
const router = express.Router();

const {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
} = require("../controllers/expenseController");
const protect = require("../middleware/authMiddleware");

// @route POST api/expenses
router.post("/", protect, createExpense);

// @route GET api/expenses
router.get("/", protect, getExpenses);

// @route GET api/expenses/id
router.get("/:id", protect, getExpenseById);

// @route PUT api/expenses
router.put("/:id", protect, updateExpense);

// @route DELETE api/expenses/id
router.delete("/:id", protect, deleteExpense);

module.exports = router;

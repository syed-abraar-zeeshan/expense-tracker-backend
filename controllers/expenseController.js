const Expense = require("../models/Expense");
const logger = require("../config/logger");
const Category = require("../models/Category");
const createError = require("http-errors");
const mongoose = require("mongoose");
const { expenseSchema } = require("../validators/expenseValidator");
const { formatCategory } = require("../utils/formatters");

//@desc    Create new expense
//@route   POST /api/expenses
//@access  Private

const createExpense = async (req, res) => {
  expenseSchema.parse(req.body);
  const { title, amount, category, date, note, type } = req.body;

  if (!mongoose.Types.ObjectId.isValid(category)) {
    throw createError(400, "Invalid category id");
  }

  // Check if category exists
  const categoryExists = await Category.findById(category);
  if (!categoryExists) {
    throw createError(400, "Category not found");
  }

  // Create new expense
  const expense = await Expense.create({
    userId: req.user.id,
    title,
    amount,
    category,
    date,
    note,
    type,
  });

  logger.info(`Expense created successfully by user: ${req.user.id}`);

  const expenseResponse = {
    id: expense._id.toString(),
    title: expense.title,
    amount: expense.amount,
    categoryId: expense.category,
    date: expense.date,
    note: expense.note,
    type: expense.type,
    createdAt: expense.createdAt,
  };

  return res.status(201).json({
    success: true,
    message: "Expense created successfully",
    data: expenseResponse,
  });
};

//@desc    Get all expenses for user
//@route   GET /api/expenses
//@access  Private
const getExpenses = async (req, res) => {
  const expenses = await Expense.find({ userId: req.user.id })
    .populate("category", "name icon color")
    .sort({ date: -1 })
    .lean();

  const formattedExpenses = expenses.map((expense) => ({
    id: expense._id.toString(),
    title: expense.title,
    amount: expense.amount,
    category: formatCategory(expense.category),
    date: expense.date,
    note: expense.note,
    type: expense.type,
    createdAt: expense.createdAt,
  }));

  return res.status(200).json({
    success: true,
    count: formattedExpenses.length,
    data: formattedExpenses,
  });
};

// @desc Get single expense
// @route GET /api/expenses/:id
// @access Private
const getExpenseById = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw createError(400, "Invalid expense id");
  }
  const expense = await Expense.findById(req.params.id)
    .populate("category", "name icon color")
    .lean();

  if (!expense) {
    throw createError(404, "Expense not found");
  }

  if (expense.userId.toString() !== req.user.id) {
    throw createError(403, "Not authorized");
  }

  const expenseResponse = {
    id: expense._id.toString(),
    title: expense.title,
    amount: expense.amount,
    category: formatCategory(expense.category),
    date: expense.date,
    note: expense.note,
    type: expense.type,
    createdAt: expense.createdAt,
    updatedAt: expense.updatedAt,
  };

  return res.status(200).json({
    success: true,
    data: expenseResponse,
  });
};

//@desc Update expense
//@route PUT /api/expenses/:id
//@access Private

const updateExpense = async (req, res) => {
  expenseSchema.partial().parse(req.body);
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw createError(400, "Invalid expense id");
  }

  const expense = await Expense.findById(req.params.id);

  if (!expense) {
    throw createError(404, "Expense not found");
  }

  if (expense.userId.toString() !== req.user.id) {
    throw createError(403, "Not authorized");
  }

  // Only allow safe fields — prevents userId/createdAt injection
  const { title, amount, category, date, note, type } = req.body;

  const updatedExpense = await Expense.findByIdAndUpdate(
    req.params.id,
    { title, amount, category, date, note, type },
    { new: true, runValidators: true },
  ).populate("category", "name icon color");

  logger.info(`Expense updated successfully by user: ${req.user.id}`);

  return res.status(200).json({
    success: true,
    message: "Expense updated successfully",
    data: {
      id: updatedExpense._id.toString(),
      title: updatedExpense.title,
      amount: updatedExpense.amount,
      category: formatCategory(updatedExpense.category),
      date: updatedExpense.date,
      note: updatedExpense.note,
      type: updatedExpense.type,
      createdAt: updatedExpense.createdAt,
      updatedAt: updatedExpense.updatedAt,
    },
  });
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private
const deleteExpense = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw createError(400, "Invalid expense id");
  }
  const expense = await Expense.findById(req.params.id);

  if (!expense) {
    throw createError(404, "Expense not found");
  }

  if (expense.userId.toString() !== req.user.id) {
    throw createError(403, "Not authorized");
  }

  await expense.deleteOne();

  logger.info(`Expense deleted successfully by user: ${req.user.id}`);

  return res.status(200).json({
    success: true,
    message: "Expense deleted successfully",
  });
};

module.exports = {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
};

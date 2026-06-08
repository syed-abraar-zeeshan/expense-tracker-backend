const Expense = require("../models/Expense");
const logger = require("../config/logger");
const Category = require("../models/Category");
const createError = require("http-errors");
const mongoose = require("mongoose");

//@desc    Create new expense
//@route   POST /api/expenses
//@access  Private

const createExpense = async (req, res, next) => {
  try {
    const { title, amount, category, date, note, type } = req.body;

    // Validate required fields
    if (!title || amount === undefined || !category || !type) {
      throw createError(400, "Please provide all required fields");
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

    logger.success(`Expense created successfully by user: ${req.user.id}`);

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
  } catch (error) {
    logger.error(`Error creating expense: ${error.message}`);
    next(error);
  }
};

//@desc    Get all expenses for user
//@route   GET /api/expenses
//@access  Private
const getExpenses = async (req, res, next) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id })
      .populate("category", "name icon color")
      .sort({ date: -1 })
      .lean();

    const formattedExpenses = expenses.map((expense) => ({
      id: expense._id.toString(),
      title: expense.title,
      amount: expense.amount,
      category: expense.category
        ? {
            id: expense.category._id.toString(),
            name: expense.category.name,
            icon: expense.category.icon,
            color: expense.category.color,
          }
        : null,
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
  } catch (error) {
    logger.error(`Error fetching expenses: ${error.message}`);
    next(error);
  }
};

// @desc Get single expense
// @route GET /api/expenses/:id
// @access Private
const getExpenseById = async (req, res, next) => {
  try {
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
      category: expense.category
        ? {
            id: expense.category._id.toString(),
            name: expense.category.name,
            icon: expense.category.icon,
            color: expense.category.color,
          }
        : null,
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
  } catch (error) {
    logger.error(`Get expense error: ${error.message}`);

    next(error);
  }
};

//@desc Update expense
//@route PUT /api/expenses/:id
//@access Private

const updateExpense = async (req, res, next) => {
  try {
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

    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    ).populate("category", "name icon color");

    const expenseResponse = {
      id: updatedExpense._id.toString(),
      title: updatedExpense.title,
      amount: updatedExpense.amount,
      category: updatedExpense.category
        ? {
            id: updatedExpense.category._id.toString(),
            name: updatedExpense.category.name,
            icon: updatedExpense.category.icon,
            color: updatedExpense.category.color,
          }
        : null,
      date: updatedExpense.date,
      note: updatedExpense.note,
      type: updatedExpense.type,
      createdAt: updatedExpense.createdAt,
      updatedAt: updatedExpense.updatedAt,
    };

    return res.status(200).json({
      success: true,
      message: "Expense updated successfully",
      data: expenseResponse,
    });
  } catch (error) {
    logger.error(`Update expense error: ${error.message}`);

    next(error);
  }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private
const deleteExpense = async (req, res, next) => {
  try {
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

    return res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (error) {
    logger.error(`Delete expense error: ${error.message}`);

    next(error);
  }
};

module.exports = {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
};

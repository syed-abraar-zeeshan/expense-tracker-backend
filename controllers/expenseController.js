const Expense = require("../models/Expense");
const logger = require("../config/logger");
const Category = require("../models/Category");

//@desc    Create new expense
//@route   POST /api/expenses
//@access  Private

const createExpense = async (req, res) => {
  try {
    const { title, amount, category, date, note, type } = req.body;

    // Validate required fields
    if (!title || !amount || !category || !type) {
      res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Check if category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: "Catergory not found",
      });
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

    res.status(201).json({
      success: true,
      message: "Expense created successfully",
      data: expenseResponse,
    });
  } catch (error) {
    logger.error(`Error creating expense: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//@desc    Get all expenses for user
//@route   GET /api/expenses
//@access  Private
const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id })
      .populate("category", "name icon color")
      .sort({ date: -1 })
      .lean();

    const formattedExpenses = expenses.map((expense) => ({
      id: expense._id.toString(),
      title: expense.title,
      amount: expense.amount,
      category: {
        id: expense.category._id.toString(),
        name: expense.category.name,
        icon: expense.category.icon,
        color: expense.category.color,
      },
      date: expense.date,
      note: expense.note,
      type: expense.type,
      createdAt: expense.createdAt,
    }));

    res.status(200).json({
      success: true,
      count: formattedExpenses.length,
      data: formattedExpenses,
    });
  } catch (error) {
    logger.error(`Error fetching expenses: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = { createExpense, getExpenses };

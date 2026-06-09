const Expense = require("../models/Expense");
const logger = require("../config/logger");

// @desc    Get dashboard data
// @route   GET /api/dashboard
// @access  Private

const getDashboard = async (req, res) => {
  const expenses = await Expense.find({
    userId: req.user.id,
  })
    .populate("category", "name icon color")
    .sort({ date: -1 })
    .lean();

  const totalIncome = expenses
    .filter((expense) => expense.type === "income")
    .reduce((sum, expense) => sum + expense.amount, 0);
  const totalExpense = expenses
    .filter((expense) => expense.type === "expense")
    .reduce((sum, expense) => sum + expense.amount, 0);

  const balance = totalIncome - totalExpense;
  const transactionCount = expenses.length;
  const recentTransactions = expenses.slice(0, 5).map((expense) => ({
    id: expense._id.toString(),
    title: expense.title,
    amount: expense.amount,
    type: expense.type,
    date: expense.date,
    category: expense.category
      ? {
          id: expense.category._id.toString(),
          name: expense.category.name,
          icon: expense.category.icon,
          color: expense.category.color,
        }
      : null,
  }));

  logger.info(`Dashboard fetched successfully for user: ${req.user.email}`);

  return res.status(200).json({
    success: true,
    data: {
      totalIncome,
      totalExpense,
      balance,
      transactionCount,
      recentTransactions,
    },
  });
};

module.exports = { getDashboard };

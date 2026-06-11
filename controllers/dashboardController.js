const Expense = require("../models/Expense");
const logger = require("../config/logger");
const { formatCategory } = require("../utils/formatters");

// @desc    Get dashboard data
// @route   GET /api/dashboard
// @access  Private

const getDashboard = async (req, res) => {
  const [allExpenses, recentExpenses] = await Promise.all([
    Expense.find({ userId: req.user.id }).lean(),
    Expense.find({ userId: req.user.id })
      .populate("category", "name icon color")
      .sort({ date: -1 })
      .limit(5)
      .lean(),
  ]);

  const totalIncome = allExpenses
    .filter((expense) => expense.type === "income")
    .reduce((sum, expense) => sum + expense.amount, 0);

  const totalExpense = allExpenses
    .filter((expense) => expense.type === "expense")
    .reduce((sum, expense) => sum + expense.amount, 0);

  const balance = totalIncome - totalExpense;
  const transactionCount = allExpenses.length;

  const recentTransactions = recentExpenses.map((expense) => ({
    id: expense._id.toString(),
    title: expense.title,
    amount: expense.amount,
    type: expense.type,
    date: expense.date,
    category: formatCategory(expense.category),
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

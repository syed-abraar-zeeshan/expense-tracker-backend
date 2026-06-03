const Category = require("../models/Category");
const logger = require("../config/logger");

// @desc list all categories
// @route GET /api/categories
// @access Public

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 }).lean();

    const formattedCategories = categories.map((category, index) => ({
      //   categoryId: index + 1,
      id: category._id.toString(),
      name: category.name,
      icon: category.icon,
      color: category.color,
    }));
    res.status(200).json({
      success: true,
      data: formattedCategories,
      count: formattedCategories.length,
    });
  } catch (error) {
    logger.error(`Get categories error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { getCategories };

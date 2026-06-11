const Category = require("../models/Category");

// @desc list all categories
// @route GET /api/categories
// @access Public

const getCategories = async (req, res) => {
  const categories = await Category.find().sort({ name: 1 }).lean();

  const formattedCategories = categories.map((category) => ({
    //   categoryId: index + 1,
    id: category._id.toString(),
    name: category.name,
    icon: category.icon,
    color: category.color,
  }));
  return res.status(200).json({
    success: true,
    data: formattedCategories,
    count: formattedCategories.length,
  });
};

module.exports = { getCategories };

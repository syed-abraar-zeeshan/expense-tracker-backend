const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
    },
    icon: {
      type: String,
      default: "📦",
    },
    color: {
      type: String,
      default: "#000000",
    },
  },
  {
    timestamps: true,
  },
);

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;

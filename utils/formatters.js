const formatCategory = (category) => {
  if (!category) return null;

  return {
    id: category._id.toString(),
    name: category.name,
    icon: category.icon,
    color: category.color,
  };
};

module.exports = {
  formatCategory,
};

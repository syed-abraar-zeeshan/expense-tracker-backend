const sanitize = (obj) => {
  if (!obj || typeof obj !== "object") return obj;
  for (const key of Object.keys(obj)) {
    if (key.startsWith("$") || key.includes(".")) {
      delete obj[key];
    } else {
      sanitize(obj[key]);
    }
  }
  return obj;
};

module.exports = sanitize;

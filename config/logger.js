const logger = {
  success: (message) => {
    console.log(`✅ [SUCCESS] ${new Date().toISOString()} - ${message}`);
  },

  error: (message) => {
    console.error(`❌ [ERROR] ${new Date().toISOString()} - ${message}`);
  },

  info: (message) => {
     console.log(`ℹ️  [INFO] ${new Date().toISOString()} - ${message}`);
  },

  warning: (message) => {
    console.log(`⚠️ [WARNING] ${new Date().toISOString()} - ${message}`);
  }
}

module.exports = logger;
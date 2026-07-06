// Import initializeApp() and cert() from Firebase Admin SDK
const { initializeApp, cert } = require("firebase-admin/app");

// Import getMessaging() to send push notifications
const { getMessaging } = require("firebase-admin/messaging");

// Load the Firebase service account JSON file
const serviceAccount = require("../firebase-service-account.json");

// Initialize Firebase Admin SDK using the service account credentials
initializeApp({
  credential: cert(serviceAccount), // Authenticate the backend with Firebase
});

module.exports = getMessaging(); // Export the messaging service for sending notifications

// const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { credentials } = require("./credentials");

admin.initializeApp({
  credential: admin.credential.applicationDefault(credentials.service_account),
});
const db = admin.firestore();

module.exports = {
  db,
};

// const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { credentials } = require("./development_credentials");

admin.initializeApp({
  credential: admin.credential.applicationDefault(credentials.service_account),
});
const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true });

module.exports = {
  db,
};

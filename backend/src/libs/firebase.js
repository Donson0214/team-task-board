const admin = require("firebase-admin");
const path = require("path");

const serviceAccount = require(path.join(
  __dirname,
  "..",
  "config",
  "firebaseServiceKey.json"
));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "YOUR_REAL_BUCKET_NAME.appspot.com", // <-- FIX THIS
  });
  console.log("🔥 Firebase Admin Initialized");
}

const bucket = admin.storage().bucket();

module.exports = { admin, bucket };

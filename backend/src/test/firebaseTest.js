const admin = require("../config/firebase");

(async () => {
  try {
    const list = await admin.auth().listUsers(1);
    console.log("Firebase connected:", list.users.length, "users found");
  } catch (err) {
    console.error("Firebase error:", err);
  }
})();

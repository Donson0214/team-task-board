const axios = require("axios");

// Your REAL Firebase Web API Key
const API_KEY = "AIzaSyCccreTmP58KjBmPWb9_vPmis1BV2HPbdM";

// MUST match an existing Firebase Auth user
const email = "test@example.com";
const password = "password123";

async function getFirebaseToken() {
  try {
    const res = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
      {
        email,
        password,
        returnSecureToken: true,
      }
    );

    console.log("\n🔥 Firebase ID Token:\n");
    console.log(res.data.idToken);
    console.log("\nUse this in your requests:");
    console.log("Authorization: Bearer <token>\n");

  } catch (err) {
    console.log("❌ Error getting token:");
    console.dir(err.response?.data || err, { depth: 5 });
  }
}

getFirebaseToken();

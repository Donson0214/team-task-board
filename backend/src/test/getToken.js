const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", "..", ".env") });

const jwt = require("jsonwebtoken");

console.log("Loaded secret:", process.env.JWT_SECRET); // debug line

const token = jwt.sign(
  {
    id: "test-user-id",
    email: "test@example.com"
  },
  process.env.JWT_SECRET,
  { expiresIn: "1h" }
);

console.log("Your test token:", token);

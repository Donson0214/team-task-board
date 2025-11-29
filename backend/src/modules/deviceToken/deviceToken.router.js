const express = require("express");
const router = express.Router();
const controller = require("./deviceToken.controller");
const { requireAuth } = require("../../middleware/auth");

// Apply auth to all routes
router.use(requireAuth);

// Save device token
router.post(
  "/device-tokens",
  controller.saveToken
);

// Remove device token
router.delete(
  "/device-tokens/:id",
  controller.removeToken
);

module.exports = router;

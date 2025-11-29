const router = require("express").Router();
const { requireAuth } = require("../../middleware/auth");
const controller = require("./audit.controller");

// Workspace logs
router.get(
  "/workspace/:workspaceId",
  requireAuth,
  controller.getWorkspaceLogs
);

// Task logs
router.get(
  "/task/:taskId",
  requireAuth,
  controller.getTaskLogs
);

module.exports = router;

const router = require("express").Router();
const { requireAuth } = require("../../middleware/auth");
const controller = require("./notification.controller");

// Get all notifications for authenticated user
router.get(
  "/",
  requireAuth,
  controller.getMyNotifications
);

// Mark a single notification as read
router.put(
  "/:notificationId",
  requireAuth,
  controller.markRead
);

// Mark all notifications as read
router.put(
  "/mark/all",
  requireAuth,
  controller.markAllRead
);

module.exports = router;

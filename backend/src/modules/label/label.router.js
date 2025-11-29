const express = require("express");
const router = express.Router();
const controller = require("./label.controller");
const { requireAuth } = require("../../middleware/auth");
const { requireBoardAccess, requireTaskAccess } = require("../../utils/permissions");

// All label routes require authentication
router.use(requireAuth);

// Create label
router.post(
  "/boards/:boardId/labels",
  async (req, res, next) => {
    try {
      await requireBoardAccess(req.params.boardId, req.user.id);
      next();
    } catch (err) {
      res.status(err.status || 403).json({ message: err.message });
    }
  },
  controller.createLabel
);

// Get labels
router.get(
  "/boards/:boardId/labels",
  async (req, res, next) => {
    try {
      await requireBoardAccess(req.params.boardId, req.user.id);
      next();
    } catch (err) {
      res.status(err.status || 403).json({ message: err.message });
    }
  },
  controller.getLabels
);

// Update label
router.patch(
  "/labels/:labelId",
  async (req, res, next) => {
    try {
      // Board access check happens inside controller or via label lookup
      next();
    } catch (err) {
      res.status(err.status || 403).json({ message: err.message });
    }
  },
  controller.updateLabel
);

// Delete label
router.delete(
  "/labels/:labelId",
  async (req, res, next) => {
    try {
      // Same note: controller should ensure workspace access
      next();
    } catch (err) {
      res.status(err.status || 403).json({ message: err.message });
    }
  },
  controller.deleteLabel
);

// Assign label to task
router.post(
  "/tasks/:taskId/labels/:labelId",
  async (req, res, next) => {
    try {
      await requireTaskAccess(req.params.taskId, req.user.id);
      next();
    } catch (err) {
      res.status(err.status || 403).json({ message: err.message });
    }
  },
  controller.assignLabel
);

// Remove label from task
router.delete(
  "/tasks/:taskId/labels/:labelId",
  async (req, res, next) => {
    try {
      await requireTaskAccess(req.params.taskId, req.user.id);
      next();
    } catch (err) {
      res.status(err.status || 403).json({ message: err.message });
    }
  },
  controller.removeLabel
);

module.exports = router;

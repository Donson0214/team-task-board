const express = require("express");
const router = express.Router({ mergeParams: true });

const controller = require("./task.controller");
const { requireAuth } = require("../../middleware/auth");

router.use(requireAuth);

// CREATE TASK
router.post(
  "/columns/:columnId/tasks",
  controller.createTask
);

// GET TASKS IN COLUMN
router.get(
  "/columns/:columnId/tasks",
  controller.getColumnTasks
);

// UPDATE TASK
router.patch(
  "/tasks/:taskId",
  controller.updateTask
);

// MOVE TASK
router.put(
  "/tasks/:taskId/move",
  controller.moveTask
);

// DELETE TASK
router.delete(
  "/tasks/:taskId",
  controller.deleteTask
);

// LABELS
router.post(
  "/tasks/:taskId/labels",
  controller.addLabel
);

router.delete(
  "/tasks/:taskId/labels/:labelId",
  controller.removeLabel
);

module.exports = router;

const express = require("express");
const router = express.Router({ mergeParams: true });

const controller = require("./board.controller");
const { requireAuth } = require("../../middleware/auth");
const {
  workspaceMemberMiddleware,
  workspaceOwnerMiddleware,
} = require("../../utils/permissions");

// All board routes require auth
router.use(requireAuth);

// Create board
router.post("/",
  workspaceMemberMiddleware,
  controller.createBoard
);

// Get boards in workspace
router.get("/",
  workspaceMemberMiddleware,
  controller.getBoards
);

// Get single board
router.get("/:boardId",
  workspaceMemberMiddleware,
  controller.getBoardById
);

// Update board (owner only)
router.patch("/:boardId",
  workspaceOwnerMiddleware,
  controller.updateBoard
);

// Delete board (owner only)
router.delete("/:boardId",
  workspaceOwnerMiddleware,
  controller.deleteBoard
);

module.exports = router;

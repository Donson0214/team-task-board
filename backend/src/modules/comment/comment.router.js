const router = require("express").Router({ mergeParams: true });
const { requireAuth } = require("../../middleware/auth");
const controller = require("./comment.controller");
const { requireTaskAccess } = require("../../utils/permissions");

router.use(requireAuth);

/**
 * FINAL COMMENT ROUTES
 * 
 * POST   /workspaces/:workspaceId/boards/:boardId/tasks/:taskId/comments
 * GET    /workspaces/:workspaceId/boards/:boardId/tasks/:taskId/comments
 * DELETE /workspaces/:workspaceId/boards/:boardId/comments/:commentId
 */

// CREATE COMMENT
router.post(
  "/tasks/:taskId/comments",
  async (req, res, next) => {
    try {
      await requireTaskAccess(req.params.taskId, req.user.id);
      next();
    } catch (err) {
      res.status(err.status || 403).json({ message: err.message });
    }
  },
  controller.createComment
);

// LIST COMMENTS
router.get(
  "/tasks/:taskId/comments",
  async (req, res, next) => {
    try {
      await requireTaskAccess(req.params.taskId, req.user.id);
      next();
    } catch (err) {
      res.status(err.status || 403).json({ message: err.message });
    }
  },
  controller.getComments
);

// DELETE COMMENT
router.delete(
  "/comments/:commentId",
  controller.deleteComment
);

module.exports = router;

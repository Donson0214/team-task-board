const router = require("express").Router({ mergeParams: true });
const { requireAuth } = require("../../middleware/auth");
const controller = require("./column.controller");
const { requireBoardAccess, requireColumnAccess } = require("../../utils/permissions");

// CREATE COLUMN
router.post(
  "/columns",
  requireAuth,
  async (req, res, next) => {
    try {
      await requireBoardAccess(req.params.boardId, req.user.id);
      next();
    } catch (err) {
      res.status(err.status || 403).json({ message: err.message });
    }
  },
  controller.createColumn
);

// GET COLUMNS
router.get(
  "/columns",
  requireAuth,
  async (req, res, next) => {
    try {
      await requireBoardAccess(req.params.boardId, req.user.id);
      next();
    } catch (err) {
      res.status(err.status || 403).json({ message: err.message });
    }
  },
  controller.getColumns
);

// UPDATE COLUMN
router.patch(
  "/columns/:columnId",
  requireAuth,
  async (req, res, next) => {
    try {
      await requireColumnAccess(req.params.columnId, req.user.id);
      next();
    } catch (err) {
      res.status(err.status || 403).json({ message: err.message });
    }
  },
  controller.updateColumn
);

// DELETE COLUMN
router.delete(
  "/columns/:columnId",
  requireAuth,
  async (req, res, next) => {
    try {
      await requireColumnAccess(req.params.columnId, req.user.id);
      next();
    } catch (err) {
      res.status(err.status || 403).json({ message: err.message });
    }
  },
  controller.deleteColumn
);

module.exports = router;

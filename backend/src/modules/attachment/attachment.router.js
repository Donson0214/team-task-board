const router = require("express").Router({ mergeParams: true });
const { requireAuth } = require("../../middleware/auth");
const upload = require("../../middleware/upload"); // memoryStorage + validation
const controller = require("./attachment.controller");
const { requireTaskAccess } = require("../../utils/permissions");

// REQUIRE AUTH FOR ALL ROUTES
router.use(requireAuth);

// UPLOAD ATTACHMENT
router.post(
  "/tasks/:taskId/attachments",
  async (req, res, next) => {
    try {
      await requireTaskAccess(req.params.taskId, req.user.id); // 🟢 correct
      next();
    } catch (err) {
      res.status(err.status || 403).json({ message: err.message });
    }
  },
  upload.single("file"),            // 🟢 correct key name
  controller.uploadAttachment       // 🟢 correct name
);

// LIST ATTACHMENTS
router.get(
  "/tasks/:taskId/attachments",
  async (req, res, next) => {
    try {
      await requireTaskAccess(req.params.taskId, req.user.id);
      next();
    } catch (err) {
      res.status(err.status || 403).json({ message: err.message });
    }
  },
  controller.getAttachments
);

// DELETE ATTACHMENTS
router.delete("/attachments/:attachmentId", controller.deleteAttachment);

module.exports = router;

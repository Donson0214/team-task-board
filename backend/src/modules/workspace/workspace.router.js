const express = require("express");
const router = express.Router();

const controller = require("./workspace.controller");
const { requireAuth } = require("../../middleware/auth");

const {
  workspaceMemberMiddleware,
  workspaceOwnerMiddleware,
} = require("../../utils/permissions");

router.use(requireAuth);

// Workspaces
router.post("/", controller.create);
router.get("/", controller.list);

router.get("/:workspaceId", workspaceMemberMiddleware, controller.getOne);
router.patch("/:workspaceId", workspaceOwnerMiddleware, controller.update);
router.delete("/:workspaceId", workspaceOwnerMiddleware, controller.remove);

// Members
router.post("/:workspaceId/members", workspaceOwnerMiddleware, controller.addMember);
router.patch("/:workspaceId/members/:memberId", workspaceOwnerMiddleware, controller.updateMemberRole);
router.delete("/:workspaceId/members/:memberId", workspaceOwnerMiddleware, controller.removeMember);

module.exports = router;

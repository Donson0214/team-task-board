const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { auditLog } = require("../../utils/audit");
const {
  requireWorkspaceMember,
  requireWorkspaceOwnerOrMember,
  requireWorkspaceOwner,
} = require("../../utils/permissions");

const { emitToWorkspace } = require("../../realtime/socket");


// Extract @mentions from comment content
function extractMentions(content) {
  const regex = /@([\w.-]+)/g;
  const matches = [...content.matchAll(regex)];
  return matches.map((m) => m[1]);
}

module.exports = {
  // CREATE COMMENT
  createComment: async (taskId, userId, content) => {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { board: true },
    });
    if (!task) throw new Error("Task not found");

    await requireWorkspaceMember(task.board.workspaceId, userId);

    const comment = await prisma.taskComment.create({
      data: { taskId, userId, content },
      include: { user: true },
    });

    // 🔥 REAL-TIME EVENT
    emitToWorkspace(task.board.workspaceId, "comment:added", {
      comment,
      taskId,
    });

    // Handle mentions
    const mentions = extractMentions(content);
    if (mentions.length > 0) {
      const mentionedUsers = await prisma.user.findMany({
        where: {
          OR: [
            { email: { in: mentions } },
            { name: { in: mentions } },
          ],
        },
      });
      console.log("MENTIONED USERS:", mentionedUsers);
    }

    await auditLog(
      userId,
      task.board.workspaceId,
      "COMMENT_CREATE",
      JSON.stringify({ taskId, content })
    );

    return {
      success: true,
      message: "Comment added",
      data: comment,
    };
  },

  // GET COMMENTS
  getComments: async (taskId, userId) => {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { board: true },
    });
    if (!task) throw new Error("Task not found");

    await requireWorkspaceMember(task.board.workspaceId, userId);

    const comments = await prisma.taskComment.findMany({
      where: { taskId },
      include: { user: true },
      orderBy: { createdAt: "asc" },
    });

    return {
      success: true,
      message: "Comments loaded",
      data: comments,
    };
  },

  // DELETE COMMENT
  deleteComment: async (commentId, userId) => {
    const comment = await prisma.taskComment.findUnique({
      where: { id: commentId },
      include: {
        user: true,
        task: { include: { board: true } },
      },
    });

    if (!comment) throw new Error("Comment not found");

    const workspaceId = comment.task.board.workspaceId;

    if (comment.userId !== userId) {
      await requireWorkspaceOwner(workspaceId, userId);
    }

    await prisma.taskComment.delete({ where: { id: commentId } });

    await auditLog(
      userId,
      workspaceId,
      "COMMENT_DELETE",
      JSON.stringify({ commentId })
    );

    return {
      success: true,
      message: "Comment deleted",
    };
  },
};

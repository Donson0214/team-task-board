const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { requireWorkspaceMember, requireWorkspaceOwner } = require("../../utils/permissions");
const { auditLog } = require("../../utils/audit");

module.exports = {
createBoard: async (workspaceId, userId, data) => {
  await requireWorkspaceMember(workspaceId, userId);

  const board = await prisma.board.create({
    data: {
      name: data.name,
      workspaceId,
    },
  });

  // FIXED
  await auditLog(
    userId,
    workspaceId,
    "BOARD_CREATE",
    `Board created: ${board.name}`,
    null,
    board.id
  );

  return {
    success: true,
    message: "Board created",
    data: board,
  };
},


  getBoards: async (workspaceId, userId) => {
    await requireWorkspaceMember(workspaceId, userId);

    const boards = await prisma.board.findMany({
      where: { workspaceId },
      orderBy: { createdAt: "asc" },
    });

    return {
      success: true,
      message: "Boards loaded",
      data: boards,
    };
  },

  getBoardById: async (boardId, userId) => {
    const board = await prisma.board.findUnique({
      where: { id: boardId },
      include: {
        columns: true,
        tasks: true,
      },
    });

    if (!board) {
      return { success: false, message: "Board not found" };
    }

    await requireWorkspaceMember(board.workspaceId, userId);

    return {
      success: true,
      message: "Board loaded",
      data: board,
    };
  },

  updateBoard: async (boardId, data, userId) => {
    const board = await prisma.board.findUnique({ where: { id: boardId } });

    if (!board) return { success: false, message: "Board not found" };

    await requireWorkspaceOwner(board.workspaceId, userId);

    const updated = await prisma.board.update({
      where: { id: boardId },
      data: {
        name: data.name,
      },
    });

    await auditLog(userId, board.workspaceId, "BOARD_UPDATE", { boardId });

    return {
      success: true,
      message: "Board updated",
      data: updated,
    };
  },

  deleteBoard: async (boardId, userId) => {
    const board = await prisma.board.findUnique({ where: { id: boardId } });
    if (!board) return { success: false, message: "Board not found" };

    await requireWorkspaceOwner(board.workspaceId, userId);

    await prisma.board.delete({ where: { id: boardId } });

    await auditLog(userId, board.workspaceId, "BOARD_DELETE", { boardId });

    return {
      success: true,
      message: "Board deleted",
    };
  },
};

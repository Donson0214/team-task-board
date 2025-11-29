const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { auditLog } = require("../../utils/audit");
const {
  requireWorkspaceMember,
  requireBoardAccess,
} = require("../../utils/permissions");

module.exports = {
  // CREATE COLUMN
  createColumn: async (boardId, userId, data) => {
    // Ensure board exists AND user belongs to the workspace
    const board = await prisma.board.findUnique({ where: { id: boardId } });
    if (!board) throw new Error("Board not found");

    await requireBoardAccess(boardId, userId);

    // Determine next order index
    const max = await prisma.column.aggregate({
      where: { boardId },
      _max: { order: true },
    });

    const nextOrder = (max._max.order ?? -1) + 1;

    const column = await prisma.column.create({
      data: {
        title: data.title,
        boardId,
        order: nextOrder,
      },
    });

    await auditLog(
      userId,
      board.workspaceId,
      "CREATE_COLUMN",
      JSON.stringify({ columnId: column.id, title: column.title })
    );

    return {
      success: true,
      message: "Column created",
      data: column,
    };
  },

  // GET COLUMNS
  getColumns: async (boardId, userId) => {
    const board = await prisma.board.findUnique({ where: { id: boardId } });
    if (!board) throw new Error("Board not found");

    await requireBoardAccess(boardId, userId);

    const columns = await prisma.column.findMany({
      where: { boardId },
      orderBy: { order: "asc" },
    });

    return {
      success: true,
      message: "Columns loaded",
      data: columns,
    };
  },

  // UPDATE COLUMN TITLE
  updateColumn: async (columnId, userId, data) => {
    const column = await prisma.column.findUnique({
      where: { id: columnId },
      include: { board: true },
    });

    if (!column) throw new Error("Column not found");

    await requireBoardAccess(column.boardId, userId);

    const updated = await prisma.column.update({
      where: { id: columnId },
      data: { title: data.title },
    });

    await auditLog(
      userId,
      column.board.workspaceId,
      "UPDATE_COLUMN",
      JSON.stringify({ columnId, title: data.title })
    );

    return {
      success: true,
      message: "Column updated",
      data: updated,
    };
  },

  // REORDER COLUMN
  reorderColumn: async (columnId, userId, newOrder) => {
    const column = await prisma.column.findUnique({
      where: { id: columnId },
      include: { board: true },
    });

    if (!column) throw new Error("Column not found");

    await requireBoardAccess(column.boardId, userId);

    // Rebuild ordering
    const boardId = column.boardId;

    const columns = await prisma.column.findMany({
      where: { boardId },
      orderBy: { order: "asc" },
    });

    const updatedList = columns
      .map((c) => (c.id === columnId ? { ...c, order: newOrder } : c))
      .sort((a, b) => a.order - b.order)
      .map((c, i) => ({ id: c.id, order: i }));

    await Promise.all(
      updatedList.map((c) =>
        prisma.column.update({
          where: { id: c.id },
          data: { order: c.order },
        })
      )
    );

    await auditLog(
      userId,
      column.board.workspaceId,
      "REORDER_COLUMN",
      JSON.stringify({ columnId, newOrder })
    );

    return {
      success: true,
      message: "Column reordered",
    };
  },

  // DELETE COLUMN
  deleteColumn: async (columnId, userId) => {
    const column = await prisma.column.findUnique({
      where: { id: columnId },
      include: { board: true, tasks: true },
    });

    if (!column) throw new Error("Column not found");

    await requireBoardAccess(column.boardId, userId);

    if (column.tasks.length > 0) {
      const err = new Error("Cannot delete a column containing tasks");
      err.status = 400;
      throw err;
    }

    await prisma.column.delete({ where: { id: columnId } });

    await auditLog(
      userId,
      column.board.workspaceId,
      "DELETE_COLUMN",
      JSON.stringify({ columnId })
    );

    return {
      success: true,
      message: "Column deleted",
    };
  },
};

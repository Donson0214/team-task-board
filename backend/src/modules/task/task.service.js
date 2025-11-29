const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { auditLog } = require("../../utils/audit");
const {
  requireBoardAccess,
  requireColumnAccess,
  requireTaskAccess,
} = require("../../utils/permissions");

const { emitToWorkspace } = require("../../realtime/socket.js");

module.exports = {
  // CREATE TASK
  createTask: async (boardId, columnId, userId, data) => {
    await requireBoardAccess(boardId, userId);
    await requireColumnAccess(columnId, userId);

    const task = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description ?? null,
        dueDate: data.dueDate ?? null,
        priority: data.priority ?? null,
        boardId,
        columnId,
      },
    });

    const board = await prisma.board.findUnique({ where: { id: boardId } });

    await auditLog(
      userId,
      board.workspaceId,
      "CREATE_TASK",
      JSON.stringify({ taskId: task.id, title: task.title })
    );

    emitToWorkspace(board.workspaceId, "task:created", { task });

    return {
      success: true,
      message: "Task created",
      data: task,
    };
  },

  // GET COLUMN TASKS
  getColumnTasks: async (columnId, userId) => {
    await requireColumnAccess(columnId, userId);

    const tasks = await prisma.task.findMany({
      where: { columnId },
      include: { labels: true, assignee: true },
      orderBy: { createdAt: "asc" },
    });

    return {
      success: true,
      message: "Tasks loaded",
      data: tasks,
    };
  },

  // UPDATE TASK
  updateTask: async (taskId, userId, data) => {
    const task = await requireTaskAccess(taskId, userId);

    const updated = await prisma.task.update({
      where: { id: taskId },
      data,
    });

    await auditLog(
      userId,
      task.column.board.workspaceId,
      "UPDATE_TASK",
      JSON.stringify({ taskId })
    );

    return {
      success: true,
      message: "Task updated",
      data: updated,
    };
  },

  // MOVE TASK (FIXED)
moveTask: async (taskId, userId, targetColumnId) => {
  // 1. Validate task + board access
  const task = await requireTaskAccess(taskId, userId);

  const boardId = task.boardId;

  // 2. Validate target column exists AND belongs to the same board
  const targetColumn = await prisma.column.findUnique({
    where: { id: targetColumnId },
  });

  if (!targetColumn) {
    throw { status: 404, message: "Target column not found" };
  }

  if (targetColumn.boardId !== boardId) {
    throw { status: 400, message: "Cannot move task to column of another board" };
  }

  const oldColumn = task.columnId;

  // 3. Finally update the task
  const updated = await prisma.task.update({
    where: { id: taskId },
    data: { columnId: targetColumnId },
  });

  await auditLog(
    userId,
    task.column.board.workspaceId,
    "MOVE_TASK",
    JSON.stringify({
      taskId,
      fromColumn: oldColumn,
      toColumn: targetColumnId,
    })
  );

  emitToWorkspace(task.column.board.workspaceId, "task:moved", {
    taskId,
    fromColumn: oldColumn,
    toColumn: targetColumnId,
  });

  return {
    success: true,
    message: "Task moved",
    data: updated,
  };
},


  // DELETE TASK
  deleteTask: async (taskId, userId) => {
    const task = await requireTaskAccess(taskId, userId);

    await prisma.task.delete({ where: { id: taskId } });

    await auditLog(
      userId,
      task.column.board.workspaceId,
      "DELETE_TASK",
      JSON.stringify({ taskId })
    );

    return {
      success: true,
      message: "Task deleted",
    };
  },

  // ADD LABEL
  addLabel: async (taskId, userId, { name, color }) => {
    const task = await requireTaskAccess(taskId, userId);

    const label = await prisma.label.create({
      data: {
        name,
        color,
        tasks: { connect: { id: taskId } },
      },
    });

    return {
      success: true,
      message: "Label added",
      data: label,
    };
  },

  // REMOVE LABEL
  removeLabel: async (taskId, userId, labelId) => {
    await requireTaskAccess(taskId, userId);

    await prisma.label.delete({
      where: { id: labelId },
    });

    return {
      success: true,
      message: "Label removed",
    };
  },
};

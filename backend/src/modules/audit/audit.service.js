const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const {
  requireWorkspaceMember,
} = require("../../utils/permissions");

module.exports = {
  // GET WORKSPACE LOGS
  getWorkspaceLogs: async (workspaceId, userId, query) => {
    const { page, limit, action, taskId, userId: filterUserId } = query;

    await requireWorkspaceMember(workspaceId, userId);

    const where = {
      workspaceId,
      ...(action ? { action } : {}),
      ...(taskId ? { taskId } : {}),
      ...(filterUserId ? { userId: filterUserId } : {}),
    };

    const logs = await prisma.auditLog.findMany({
      where,
      include: {
        user: true,
        task: true,
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await prisma.auditLog.count({ where });

    return {
      success: true,
      message: "Workspace audit logs loaded",
      data: logs,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  },

  // GET TASK LOGS
  getTaskLogs: async (taskId, userId, query) => {
    const { page, limit, action, userId: filterUserId } = query;

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { board: true },
    });

    if (!task) throw new Error("Task not found");

    await requireWorkspaceMember(task.board.workspaceId, userId);

    const where = {
      taskId,
      ...(action ? { action } : {}),
      ...(filterUserId ? { userId: filterUserId } : {}),
    };

    const logs = await prisma.auditLog.findMany({
      where,
      include: {
        user: true,
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await prisma.auditLog.count({ where });

    return {
      success: true,
      message: "Task audit logs loaded",
      data: logs,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  },
};

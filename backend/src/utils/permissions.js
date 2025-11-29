console.log(">>> RUNNING PERMISSIONS FILE FROM:", __filename);

const prisma = require("../libs/prisma");

// Throw standardized error
function throwForbidden(msg = "Forbidden") {
  const err = new Error(msg);
  err.status = 403;
  throw err;
}

/**
 * Ensure the user is part of the workspace.
 */
async function requireWorkspaceMember(workspaceId, userId) {
  const member = await prisma.workspaceMember.findFirst({
    where: { workspaceId, userId },
  });

  if (!member) throwForbidden("You are not part of this workspace");
  return member; 
}

/**
 * Only OWNER of the workspace can perform certain actions.
 */
async function requireWorkspaceOwner(workspaceId, userId) {
  const ws = await prisma.workspace.findUnique({
    where: { id: workspaceId },
  });

  if (!ws) {
    const err = new Error("Workspace not found");
    err.status = 404;
    throw err;
  }

  if (ws.ownerId !== userId) {
    throwForbidden("Only workspace owner can perform this action");
  }

  return ws;
}

/**
 * Board access (check workspace membership)
 */
async function requireBoardAccess(boardId, userId) {
  const board = await prisma.board.findUnique({
    where: { id: boardId },
    include: { workspace: true },
  });

  if (!board) {
    const err = new Error("Board not found");
    err.status = 404;
    throw err;
  }

  await requireWorkspaceMember(board.workspaceId, userId);
  return board;
}

/**
 * Column access (check board → workspace membership)
 */
async function requireColumnAccess(columnId, userId) {
  const column = await prisma.column.findUnique({
    where: { id: columnId },
    include: {
      board: {
        include: { workspace: true },
      },
    },
  });

  if (!column) {
    const err = new Error("Column not found");
    err.status = 404;
    throw err;
  }

  await requireWorkspaceMember(column.board.workspaceId, userId);
  return column;
}

/**
 * Task access
 * Task → Column → Board → Workspace
 * (Matches your database structure)
 */
async function requireTaskAccess(taskId, userId) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      column: {
        include: {
          board: {
            include: {
              workspace: true,
            },
          },
        },
      },
    },
  });

  if (!task) {
    const err = new Error("Task not found");
    err.status = 404;
    throw err;
  }

  // Validate workspace membership
  await requireWorkspaceMember(task.column.board.workspaceId, userId);

  return task;
}

/**
 * EXPRESS middlewares
 */
async function workspaceMemberMiddleware(req, res, next) {
  try {
    const workspaceId = req.params.workspaceId;
    const userId = req.user.id;

    await requireWorkspaceMember(workspaceId, userId);
    next();
  } catch (err) {
    res.status(err.status || 403).json({ message: err.message });
  }
}

async function workspaceOwnerMiddleware(req, res, next) {
  try {
    const workspaceId = req.params.workspaceId;
    const userId = req.user.id;

    await requireWorkspaceOwner(workspaceId, userId);
    next();
  } catch (err) {
    res.status(err.status || 403).json({ message: err.message });
  }
}

module.exports = {
  throwForbidden,
  requireWorkspaceMember,
  requireWorkspaceOwner,
  requireBoardAccess,
  requireColumnAccess,
  requireTaskAccess,
  workspaceMemberMiddleware,
  workspaceOwnerMiddleware,
};

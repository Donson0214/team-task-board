const prisma = require("../libs/prisma");

/**
 * Write an audit log entry safely.
 */
async function auditLog(userId, workspaceId, action, details = null, taskId = null) {
  if (!userId) {
    console.warn("⚠️ auditLog skipped: userId is missing");
    return;
  }

  try {
    await prisma.auditLog.create({
      data: {
        userId,
        workspaceId,
        taskId,
        action,
        // FIX: Convert objects to strings to satisfy Prisma schema
        details: details ? JSON.stringify(details) : null,
      },
    });
  } catch (err) {
    console.error("❌ AuditLog Error:", err?.message);
  }
}

module.exports = { auditLog };

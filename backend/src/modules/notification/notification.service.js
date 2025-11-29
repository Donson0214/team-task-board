const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { emitToWorkspace } = require("../../realtime/socket");


// OPTIONAL: Real-time hook (logging only)
async function pushRealtime(userId, notification) {
  console.log(`🔔 Realtime notify ${userId}:`, notification.message);
}

module.exports = {
  // INTERNAL: Create a notification
  notifyUser: async (userId, message, taskId = null) => {
    const notification = await prisma.notification.create({
      data: {
        userId,
        message,
        taskId,
      },
    });

    // 🔥 Real-time event (Socket.IO)
  

    // Logging only (optional)
    pushRealtime(userId, notification);

    return notification;
  },

  // INTERNAL: Notify on task assignment
  notifyTaskAssigned: async (task, assignedUserId) => {
    await module.exports.notifyUser(
      assignedUserId,
      `You were assigned to the task "${task.title}".`,
      task.id
    );
  },

  // INTERNAL: Notify mentions in comments
  notifyMentions: async (taskId, users) => {
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) return;

    for (const user of users) {
      await module.exports.notifyUser(
        user.id,
        `You were mentioned in a comment on task "${task.title}".`,
        taskId
      );
    }
  },

  // GET NOTIFICATIONS FOR LOGGED-IN USER
  getMyNotifications: async (userId) => {
    const list = await prisma.notification.findMany({
      where: { userId },
      include: { task: true },
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      message: "Notifications loaded",
      data: list,
    };
  },

  // MARK READ / UNREAD
  markRead: async (notificationId, userId, read) => {
    const notif = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notif || notif.userId !== userId) {
      const err = new Error("Notification not found");
      err.status = 404;
      throw err;
    }

    const updated = await prisma.notification.update({
      where: { id: notificationId },
      data: { read },
    });

    return {
      success: true,
      message: "Notification updated",
      data: updated,
    };
  },

  // MARK ALL READ
  markAllRead: async (userId) => {
    await prisma.notification.updateMany({
      where: { userId },
      data: { read: true },
    });

    return {
      success: true,
      message: "All notifications marked as read",
    };
  },
};

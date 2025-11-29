const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { admin, bucket } = require("../../libs/firebase");
const { v4: uuidv4 } = require("uuid");

const { auditLog } = require("../../utils/audit");
const { requireTaskAccess } = require("../../utils/permissions");  // ✅ FIXED IMPORT

module.exports = {
  /** UPLOAD ATTACHMENT **/
  uploadAttachment: async (taskId, userId, file) => {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { board: true },
    });

    if (!task) throw new Error("Task not found");

    // ✅ FIX: Check if user has access to the task
    await requireTaskAccess(taskId, userId);

    const fileName = `${uuidv4()}-${file.originalname}`;
    const firebaseFile = bucket.file(`attachments/${fileName}`);

    await firebaseFile.save(file.buffer, {
      metadata: {
        contentType: file.mimetype,
      },
    });

    const [signedUrl] = await firebaseFile.getSignedUrl({
      action: "read",
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    });

    const attachment = await prisma.attachment.create({
      data: {
        taskId,
        fileUrl: signedUrl,
        fileName: file.originalname,
        fileType: file.mimetype,
        fileSize: file.size,
        storagePath: `attachments/${fileName}`,
      },
    });

    await auditLog(
      userId,
      task.board.workspaceId,
      "UPLOAD_ATTACHMENT",
      JSON.stringify({
        taskId,
        attachmentId: attachment.id,
      })
    );

    const tokens = await prisma.deviceToken.findMany({
      where: {
        workspaceId: task.board.workspaceId,
        userId: { not: userId },
      },
    });

    if (tokens.length > 0) {
      const message = {
        notification: {
          title: "New Attachment Added",
          body: `${file.originalname} uploaded to task: ${task.title}`,
        },
        tokens: tokens.map(t => t.token),
        data: {
          type: "ATTACHMENT",
          taskId: taskId,
          attachmentId: attachment.id,
        },
      };

      await admin.messaging().sendMulticast(message);
    }

    return {
      success: true,
      message: "Attachment uploaded",
      data: attachment,
    };
  },

  /** GET ATTACHMENTS **/
  getAttachments: async (taskId, userId) => {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { board: true },
    });

    if (!task) throw new Error("Task not found");

    // ✅ FIX
    await requireTaskAccess(taskId, userId);

    const attachments = await prisma.attachment.findMany({
      where: { taskId },
      orderBy: { createdAt: "asc" },
    });

    return {
      success: true,
      message: "Attachments loaded",
      data: attachments,
    };
  },

  /** DELETE ATTACHMENT **/
  deleteAttachment: async (attachmentId, userId) => {
    const attachment = await prisma.attachment.findUnique({
      where: { id: attachmentId },
      include: {
        task: { include: { board: true } },
      },
    });

    if (!attachment) throw new Error("Attachment not found");

    // ✅ FIX
    await requireTaskAccess(attachment.taskId, userId);

    if (attachment.storagePath) {
      await bucket.file(attachment.storagePath).delete().catch(() => {});
    }

    await prisma.attachment.delete({
      where: { id: attachmentId },
    });

    await auditLog(
      userId,
      attachment.task.board.workspaceId,
      "DELETE_ATTACHMENT",
      JSON.stringify({ attachmentId })
    );

    return {
      success: true,
      message: "Attachment deleted",
    };
  },
};

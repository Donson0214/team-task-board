const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


module.exports = {
  /**
   * Save FCM device token for a user
   */
  saveToken: async (userId, token, platform) => {
    if (!token || !platform) {
      const err = new Error("Token and platform are required");
      err.status = 400;
      throw err;
    }

    // Prevent duplicate tokens
    const existing = await prisma.deviceToken.findFirst({
      where: { token, userId },
    });

    if (existing) {
      return {
        success: true,
        message: "Token already saved",
        data: existing,
      };
    }

    const saved = await prisma.deviceToken.create({
      data: {
        userId,
        token,
        platform,
      },
    });

    return {
      success: true,
      message: "Device token saved",
      data: saved,
    };
  },

  /**
   * Remove a user's device token
   */
  removeToken: async (tokenId, userId) => {
    const token = await prisma.deviceToken.findUnique({
      where: { id: tokenId },
    });

    if (!token) {
      const err = new Error("Device token not found");
      err.status = 404;
      throw err;
    }

    if (token.userId !== userId) {
      const err = new Error("Not authorized to remove this device token");
      err.status = 403;
      throw err;
    }

    await prisma.deviceToken.delete({
      where: { id: tokenId },
    });

    return {
      success: true,
      message: "Device token removed",
    };
  },
};

const { admin } = require("../libs/firebase");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Authenticate user using Firebase token.
 */
async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header) {
      return res.status(401).json({ message: "No authorization header" });
    }

    const token = header.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Missing token" });
    }

    const decoded = await admin.auth().verifyIdToken(token);

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email: decoded.email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: decoded.email,
          name: decoded.name || null,
          imageUrl: decoded.picture || null,
        },
      });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("🔴 Auth error:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

/**
 * Ensure user is a member OR owner of the workspace.
 */
async function requireWorkspaceOwnerOrMember(req, res, next) {
  try {
    const { workspaceId } = req.params;

    if (!workspaceId) {
      return res.status(400).json({ message: "Workspace ID missing" });
    }

    const membership = await prisma.workspaceMember.findFirst({
      where: {
        workspaceId,
        userId: req.user.id,
      },
    });

    if (!membership) {
      return res.status(403).json({
        message: "You are not authorized for this workspace",
      });
    }

    // (Optional) store role for later use
    req.membership = membership;

    next();
  } catch (err) {
    console.error("🔴 Workspace membership error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  requireAuth,
  requireWorkspaceOwnerOrMember,
};

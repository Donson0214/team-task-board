
const prisma = require("../../libs/prisma");
const { auditLog } = require("../../utils/audit");



//
// Create Workspace
//
module.exports.createWorkspace = async (userId, data) => {
  const workspace = await prisma.workspace.create({
    data: {
      name: data.name,
      ownerId: userId,
      members: {
        create: {
          userId,
          role: "OWNER",
        },
      },
    },
  });

  await auditLog(userId, workspace.id, "WORKSPACE_CREATED", {
    name: workspace.name,
  });

  return workspace;
};

//
// Get all workspaces for user
//
module.exports.getMyWorkspaces = (userId) => {
  return prisma.workspace.findMany({
    where: {
      members: {
        some: { userId },
      },
    },
  });
};

//
// Get workspace by ID
//
module.exports.getWorkspaceById = (workspaceId, userId) => {
  return prisma.workspace.findFirst({
    where: {
      id: workspaceId,
      members: {
        some: { userId },
      },
    },
    include: {
      members: {
        include: { user: true },
      },
    },
  });
};

//
// Update workspace
//
module.exports.updateWorkspace = async (workspaceId, userId, data) => {
  const updated = await prisma.workspace.update({
    where: { id: workspaceId },
    data,
  });

  await auditLog(userId, workspaceId, "WORKSPACE_UPDATED", data);

  return updated;
};

//
// Delete workspace
//
module.exports.deleteWorkspace = async (workspaceId, userId) => {
  await prisma.workspace.delete({
    where: { id: workspaceId },
  });

  await auditLog(userId, workspaceId, "WORKSPACE_DELETED");
};

//
// Add member
//
module.exports.addMember = async (workspaceId, userId, data) => {
  const member = await prisma.workspaceMember.create({
    data: {
      workspaceId,
      userId: data.userId,
      role: data.role,
    },
  });

  await auditLog(userId, workspaceId, "MEMBER_ADDED", {
    userId: data.userId,
    role: data.role,
  });

  return member;
};

//
// Update member role
//
module.exports.updateMemberRole = async (workspaceId, memberId, userId, data) => {
  const member = await prisma.workspaceMember.update({
    where: { id: memberId },
    data: { role: data.role },
  });

  await auditLog(userId, workspaceId, "MEMBER_ROLE_UPDATED", {
    memberId,
    newRole: data.role,
  });

  return member;
};

//
// Remove member
//
module.exports.removeMember = async (workspaceId, memberId, userId) => {
  await prisma.workspaceMember.delete({
    where: { id: memberId },
  });

  await auditLog(userId, workspaceId, "MEMBER_REMOVED", {
    memberId,
  });
};

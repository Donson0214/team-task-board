const { z } = require("zod");

//
// CREATE WORKSPACE
//
const createWorkspaceSchema = z.object({
  name: z.string().min(1, "Workspace name is required"),
});

//
// UPDATE WORKSPACE
//
const updateWorkspaceSchema = z.object({
  name: z.string().min(1).optional(),
});

//
// ADD MEMBER
//
const addMemberSchema = z.object({
  userId: z.string().min(1),
  role: z.enum(["OWNER", "ADMIN", "MEMBER"]).default("MEMBER"),
});

//
// UPDATE MEMBER ROLE
//
const updateMemberRoleSchema = z.object({
  role: z.enum(["OWNER", "ADMIN", "MEMBER"]),
});

module.exports = {
  createWorkspaceSchema,
  updateWorkspaceSchema,
  addMemberSchema,
  updateMemberRoleSchema,
};

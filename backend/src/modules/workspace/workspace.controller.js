const {
  createWorkspaceSchema,
  updateWorkspaceSchema,
  addMemberSchema,
  updateMemberRoleSchema,
} = require("./workspace.validation");

const {
  createWorkspace,
  getMyWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
  addMember,
  updateMemberRole,
  removeMember,
} = require("./workspace.service");

exports.create = async (req, res, next) => {
  try {
    const data = createWorkspaceSchema.parse(req.body);
    const workspace = await createWorkspace(req.user.id, data);
    res.json(workspace);
  } catch (err) {
    next(err);
  }
};

exports.list = async (req, res, next) => {
  try {
    const workspaces = await getMyWorkspaces(req.user.id);
    res.json(workspaces);
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const workspace = await getWorkspaceById(req.params.workspaceId, req.user.id);
    if (!workspace)
      return res.status(404).json({ message: "Workspace not found" });
    res.json(workspace);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const data = updateWorkspaceSchema.parse(req.body);
    const updated = await updateWorkspace(
      req.params.workspaceId,
      req.user.id,
      data
    );
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await deleteWorkspace(req.params.workspaceId, req.user.id);
    res.json({ message: "Workspace deleted" });
  } catch (err) {
    next(err);
  }
};

exports.addMember = async (req, res, next) => {
  try {
    const data = addMemberSchema.parse(req.body);
    const member = await addMember(req.params.workspaceId, req.user.id, data);
    res.json(member);
  } catch (err) {
    next(err);
  }
};

exports.updateMemberRole = async (req, res, next) => {
  try {
    const data = updateMemberRoleSchema.parse(req.body);
    const updated = await updateMemberRole(
      req.params.workspaceId,
      req.params.memberId,
      req.user.id,
      data
    );
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

exports.removeMember = async (req, res, next) => {
  try {
    await removeMember(req.params.workspaceId, req.params.memberId, req.user.id);
    res.json({ message: "Member removed" });
  } catch (err) {
    next(err);
  }
};

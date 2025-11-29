const service = require("./audit.service");
const errorHandler = require("../../utils/errorHandler");
const { validateQuery } = require("../../utils/validator");
const { auditQuerySchema } = require("./audit.validation");

module.exports = {
  // GET WORKSPACE LOGS
  getWorkspaceLogs: async (req, res) => {
    try {
      const query = validateQuery(auditQuerySchema, req.query);
      const result = await service.getWorkspaceLogs(req.params.workspaceId, req.user.id, query);
      res.json(result);
    } catch (err) {
      errorHandler(res, err);
    }
  },

  // GET TASK LOGS
  getTaskLogs: async (req, res) => {
    try {
      const query = validateQuery(auditQuerySchema, req.query);
      const result = await service.getTaskLogs(req.params.taskId, req.user.id, query);
      res.json(result);
    } catch (err) {
      errorHandler(res, err);
    }
  },
};

const Joi = require("joi");

module.exports.auditQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  action: Joi.string().allow(null, ""),
  taskId: Joi.string().allow(null, ""),
  userId: Joi.string().allow(null, ""),
});

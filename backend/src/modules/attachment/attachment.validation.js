const Joi = require("joi");

module.exports.uploadAttachmentSchema = Joi.object({
  taskId: Joi.string().required(),
});

module.exports.deleteAttachmentSchema = Joi.object({
  attachmentId: Joi.string().required(),
});

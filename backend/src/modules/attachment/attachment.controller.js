const service = require("./attachment.service");
const errorHandler = require("../../utils/errorHandler");

module.exports = {
  // UPLOAD ATTACHMENT
  uploadAttachment: async (req, res) => {
    try {
      if (!req.file) throw new Error("No file uploaded");

      const result = await service.uploadAttachment(
        req.params.taskId,
        req.user.id,
        req.file
      );

      res.json(result);
    } catch (err) {
      errorHandler(res, err);
    }
  },

  // GET ATTACHMENTS
  getAttachments: async (req, res) => {
    try {
      const result = await service.getAttachments(
        req.params.taskId,
        req.user.id
      );

      res.json(result);
    } catch (err) {
      errorHandler(res, err);
    }
  },

  // DELETE ATTACHMENT
  deleteAttachment: async (req, res) => {
    try {
      const result = await service.deleteAttachment(
        req.params.attachmentId,
        req.user.id
      );

      res.json(result);
    } catch (err) {
      errorHandler(res, err);
    }
  },
};

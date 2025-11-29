const service = require("./comment.service");
const errorHandler = require("../../utils/errorHandler");
const { validate } = require("../../utils/validator");
const { createCommentSchema } = require("./comment.validation");

module.exports = {
  createComment: async (req, res) => {
    try {
      const body = validate(createCommentSchema, req.body);
      const result = await service.createComment(
        req.params.taskId,
        req.user.id,
        body.content
      );
      res.json(result);
    } catch (err) {
      errorHandler(res, err);
    }
  },

  getComments: async (req, res) => {
    try {
      const result = await service.getComments(
        req.params.taskId,
        req.user.id
      );
      res.json(result);
    } catch (err) {
      errorHandler(res, err);
    }
  },

  deleteComment: async (req, res) => {
    try {
      const result = await service.deleteComment(
        req.params.commentId,
        req.user.id
      );
      res.json(result);
    } catch (err) {
      errorHandler(res, err);
    }
  },
};

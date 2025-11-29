const service = require("./label.service");
const errorHandler = require("../../utils/errorHandler");
const { validate } = require("../../utils/validator");

const {
  createLabelSchema,
  updateLabelSchema,
} = require("./label.validation");

module.exports = {
  createLabel: async (req, res) => {
    try {
      const body = validate(createLabelSchema, req.body);
      const result = await service.createLabel(
        req.params.boardId,
        body,
        req.user.uid
      );
      res.json(result);
    } catch (err) {
      errorHandler(res, err);
    }
  },

  getLabels: async (req, res) => {
    try {
      const result = await service.getLabels(
        req.params.boardId,
        req.user.uid
      );
      res.json(result);
    } catch (err) {
      errorHandler(res, err);
    }
  },

  updateLabel: async (req, res) => {
    try {
      const body = validate(updateLabelSchema, req.body);
      const result = await service.updateLabel(
        req.params.labelId,
        body,
        req.user.uid
      );
      res.json(result);
    } catch (err) {
      errorHandler(res, err);
    }
  },

  deleteLabel: async (req, res) => {
    try {
      const result = await service.deleteLabel(
        req.params.labelId,
        req.user.uid
      );
      res.json(result);
    } catch (err) {
      errorHandler(res, err);
    }
  },

  assignLabel: async (req, res) => {
    try {
      const { taskId, labelId } = req.params;
      const result = await service.assignLabel(
        taskId,
        labelId,
        req.user.uid
      );
      res.json(result);
    } catch (err) {
      errorHandler(res, err);
    }
  },

  removeLabel: async (req, res) => {
    try {
      const { taskId, labelId } = req.params;
      const result = await service.removeLabel(
        taskId,
        labelId,
        req.user.uid
      );
      res.json(result);
    } catch (err) {
      errorHandler(res, err);
    }
  },
};

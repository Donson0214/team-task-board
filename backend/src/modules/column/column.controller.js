const service = require("./column.service");
const errorHandler = require("../../utils/errorHandler");
const { validate } = require("../../utils/validator");

const {
  createColumnSchema,
  updateColumnSchema,
  reorderColumnSchema,
} = require("./column.validation");

module.exports = {
  // CREATE COLUMN
  createColumn: async (req, res) => {
    try {
      const body = validate(createColumnSchema, req.body);
      const result = await service.createColumn(req.params.boardId, req.user.id, body);
      res.json(result);
    } catch (err) {
      errorHandler(res, err);
    }
  },

  // LIST COLUMNS
  getColumns: async (req, res) => {
    try {
      const result = await service.getColumns(req.params.boardId, req.user.id);
      res.json(result);
    } catch (err) {
      errorHandler(res, err);
    }
  },

  // UPDATE COLUMN TITLE
  updateColumn: async (req, res) => {
    try {
      const body = validate(updateColumnSchema, req.body);
      const result = await service.updateColumn(req.params.columnId, req.user.id, body);
      res.json(result);
    } catch (err) {
      errorHandler(res, err);
    }
  },

  // REORDER COLUMN
  reorderColumn: async (req, res) => {
    try {
      const body = validate(reorderColumnSchema, req.body);
      const result = await service.reorderColumn(req.params.columnId, req.user.id, body.order);
      res.json(result);
    } catch (err) {
      errorHandler(res, err);
    }
  },

  // DELETE COLUMN
  deleteColumn: async (req, res) => {
    try {
      const result = await service.deleteColumn(req.params.columnId, req.user.id);
      res.json(result);
    } catch (err) {
      errorHandler(res, err);
    }
  },
};

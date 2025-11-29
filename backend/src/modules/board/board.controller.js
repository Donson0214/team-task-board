const service = require("./board.service");
const errorHandler = require("../../utils/errorHandler");
const { validate } = require("../../utils/validator");
const { createBoardSchema, updateBoardSchema } = require("./board.validation");

module.exports = {
  createBoard: async (req, res) => {
    try {
      const body = validate(createBoardSchema, req.body);

      const result = await service.createBoard(
        req.params.workspaceId,
        req.user.id,   // FIXED
        body
      );

      res.json(result);
    } catch (err) {
      errorHandler(res, err);
    }
  },

  getBoards: async (req, res) => {
    try {
      const result = await service.getBoards(
        req.params.workspaceId,
        req.user.id   // FIXED
      );
      res.json(result);
    } catch (err) {
      errorHandler(res, err);
    }
  },

  getBoardById: async (req, res) => {
    try {
      const result = await service.getBoardById(
        req.params.boardId,
        req.user.id   // FIXED
      );
      res.json(result);
    } catch (err) {
      errorHandler(res, err);
    }
  },

  updateBoard: async (req, res) => {
    try {
      const body = validate(updateBoardSchema, req.body);

      const result = await service.updateBoard(
        req.params.boardId,
        body,
        req.user.id   // FIXED
      );

      res.json(result);
    } catch (err) {
      errorHandler(res, err);
    }
  },

  deleteBoard: async (req, res) => {
    try {
      const result = await service.deleteBoard(
        req.params.boardId,
        req.user.id   // FIXED
      );
      res.json(result);
    } catch (err) {
      errorHandler(res, err);
    }
  },
};

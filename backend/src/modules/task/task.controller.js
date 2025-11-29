const service = require("./task.service");
const errorHandler = require("../../utils/errorHandler");
const { validate } = require("../../utils/validator");
const {
  createTaskSchema,
  updateTaskSchema,
  moveTaskSchema,
} = require("./task.validation");

module.exports = {
  // CREATE TASK
  createTask: async (req, res) => {
    try {
      const { boardId, columnId } = req.params;
      const userId = req.user.id;

      const body = validate(createTaskSchema, req.body);

      const result = await service.createTask(
        boardId,
        columnId,
        userId,
        body
      );

      res.json(result);
    } catch (err) {
      errorHandler(res, err);
    }
  },

  // GET COLUMN TASKS
  getColumnTasks: async (req, res) => {
    try {
      const { columnId } = req.params;
      const userId = req.user.id;

      const result = await service.getColumnTasks(columnId, userId);
      res.json(result);
    } catch (err) {
      errorHandler(res, err);
    }
  },

  // UPDATE TASK
  updateTask: async (req, res) => {
    try {
      const { taskId } = req.params;
      const userId = req.user.id;
      const body = validate(updateTaskSchema, req.body);

      const result = await service.updateTask(taskId, userId, body);
      res.json(result);
    } catch (err) {
      errorHandler(res, err);
    }
  },

  // MOVE TASK
  moveTask: async (req, res) => {
    try {
      const { taskId } = req.params;
      const userId = req.user.id;
      const body = validate(moveTaskSchema, req.body);

      const result = await service.moveTask(
        taskId,
        userId,
        body.targetColumnId
      );

      res.json(result);
    } catch (err) {
      errorHandler(res, err);
    }
  },

  // DELETE TASK
  deleteTask: async (req, res) => {
    try {
      const { taskId } = req.params;
      const userId = req.user.id;

      const result = await service.deleteTask(taskId, userId);
      res.json(result);
    } catch (err) {
      errorHandler(res, err);
    }
  },

  // ADD LABEL
  addLabel: async (req, res) => {
    try {
      const { taskId } = req.params;
      const userId = req.user.id;

      const result = await service.addLabel(
        taskId,
        userId,
        req.body
      );

      res.json(result);
    } catch (err) {
      errorHandler(res, err);
    }
  },

  // REMOVE LABEL
  removeLabel: async (req, res) => {
    try {
      const { taskId, labelId } = req.params;
      const userId = req.user.id;

      const result = await service.removeLabel(taskId, userId, labelId);
      res.json(result);
    } catch (err) {
      errorHandler(res, err);
    }
  },
};

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  createLabel: (boardId, data, userId) => {
    return prisma.label.create({
      data: {
        boardId,
        name: data.name,
        color: data.color,
      },
    });
  },

  getLabels: (boardId) => {
    return prisma.label.findMany({
      where: { boardId },
    });
  },

  updateLabel: (labelId, data) => {
    return prisma.label.update({
      where: { id: labelId },
      data,
    });
  },

  deleteLabel: (labelId) => {
    return prisma.label.delete({
      where: { id: labelId },
    });
  },

  assignLabel: (taskId, labelId) => {
    return prisma.taskLabel.create({
      data: { taskId, labelId },
    });
  },

  removeLabel: (taskId, labelId) => {
    return prisma.taskLabel.deleteMany({
      where: { taskId, labelId },
    });
  },
};

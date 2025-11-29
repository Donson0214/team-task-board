const { z } = require("zod");

module.exports.createColumnSchema = z.object({
  title: z.string().min(1, "Column title is required"),
});

module.exports.updateColumnSchema = z.object({
  title: z.string().min(1, "Column title is required"),
});

module.exports.reorderColumnSchema = z.object({
  order: z.number().int().min(0),
});

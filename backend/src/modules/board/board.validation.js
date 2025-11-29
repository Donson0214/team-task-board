const { z } = require("zod");

exports.createBoardSchema = z.object({
  name: z.string().min(1, "Board name is required"),
});

exports.updateBoardSchema = z.object({
  name: z.string().min(1, "Board name is required").optional(),
});

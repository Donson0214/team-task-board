const { z } = require("zod");

exports.createLabelSchema = z.object({
  name: z.string().min(1),
  color: z.string().min(1),
});

exports.updateLabelSchema = z.object({
  name: z.string().min(1).optional(),
  color: z.string().min(1).optional(),
});

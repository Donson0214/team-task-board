const { z } = require("zod");

exports.markReadSchema = z.object({
  read: z.boolean(),
});

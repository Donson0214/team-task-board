const { z } = require("zod");

const saveTokenSchema = z.object({
  token: z.string().min(1),
  platform: z.string().min(1),
});

module.exports = {
  saveTokenSchema,
};

const { z } = require("zod");

exports.createCommentSchema = z.object({
  content: z.string().min(1, "Comment content is required"),
});

exports.deleteCommentSchema = z.object({
  commentId: z.string().min(1, "Comment ID is required"),
});

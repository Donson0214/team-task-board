const { z } = require("zod");

// Helper for UUID validation
const uuid = z.string().uuid("Invalid ID format");

// --- CREATE TASK ---
module.exports.createTaskSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  description: z.string().optional().nullable(),
  dueDate: z
    .string()
    .datetime({ offset: true })
    .optional()
    .nullable(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
});

// --- UPDATE TASK ---
module.exports.updateTaskSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional().nullable(),
  dueDate: z
    .string()
    .datetime({ offset: true })
    .optional()
    .nullable(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  assigneeId: uuid.optional().nullable(),
});

// --- MOVE TASK ---
module.exports.moveTaskSchema = z.object({
  targetColumnId: uuid,
});

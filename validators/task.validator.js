import { z } from "zod";

export const taskValidatorSchema = z.object({
  title: z.string().trim().min(3, "Task Title must be at least 3 characters"),
  description: z.string().trim().optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
  dueDate: z.coerce.date().optional(),
  assignedTo: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID")
    .optional(),
});

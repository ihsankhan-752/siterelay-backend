import { z } from "zod";

export const progressReportValidationSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, "Title must be at least 3 characters")
      .max(150, "Title must be 100 characters or less"),
    progressPercentage: z.number().min(0).max(100),
    workCompleted: z
      .string()
      .trim()
      .min(5, "Completion Report is too short")
      .max(5000, "Completion Report is too long"),
    workInProgress: z
      .string()
      .trim()
      .max(3000, "Description cannot exceed 3000 characters")
      .optional(),
    pendingWork: z
      .string()
      .trim()
      .max(3000, "Description cannot exceed 3000 characters")
      .optional(),
    challenges: z
      .string()
      .trim()
      .max(3000, "Description cannot exceed 3000 characters")
      .optional(),
    nextSteps: z
      .string()
      .trim()
      .max(3000, "Description cannot exceed 3000 characters")
      .optional(),
  })
  .strict();

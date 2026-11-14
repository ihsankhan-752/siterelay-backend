import { z } from "zod";

export const projectMembershipValidationSchema = z.object({
  userId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID"),
  role: z.enum(["project manager", "worker", "client"]).default("worker"),
});

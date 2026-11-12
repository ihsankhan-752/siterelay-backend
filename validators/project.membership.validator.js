import { z } from "zod";

export const projectMembershipValidationSchema = z.object({
  role: z.enum(["project manager", "worker", "client"]).default("worker"),
});

import { z } from "zod";

export const registerSchemaValidator = z.object({
  username: z
    .string()
    .min(3, "username must be at least 3 characters")
    .max(30, "username must not exceed 30 characters"),
  email: z.string().trim().email("Please provide a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),

  role: z.enum(["user", "platform_admin"]).default("user"),
  status: z.enum(["active", "inactive", "suspended"]).default("active"),
});

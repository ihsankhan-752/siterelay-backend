import { z } from "zod";

export const invitationValidatorSchema = z.object({
  email: z.string().trim().toLowerCase().email("User email required"),
  role: z.enum(["admin", "member"]).default("member"),
});

export const acceptTokenValidatorSchema = z.object({
  token: z.string(),
});

import { z } from "zod";

export const companyValidatorSchema = z.object({
  name: z.string().trim().min(3, "Company name must ba at least 3 characters"),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid company slug"),
});

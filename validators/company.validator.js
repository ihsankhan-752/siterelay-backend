import { z } from "zod";

export const companyValidatorSchema = z.object({
  name: z.string().trim().min(3, "Company name must ba at least 3 characters"),
});

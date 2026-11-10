import { z } from "zod";

export const projectValidatorSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "Project name should be at least 3 characters"),
    description: z.string().default(""),
    startDate: z.coerce.date({
      required_error: "Start date is required",
    }),
    targetEndDate: z.coerce.date({
      required_error: "Expected end date required",
    }),
  })
  .refine(
    (data) => {
      return data.targetEndDate >= data.startDate;
    },
    {
      message: "Expected end date cannot be earlier than the start date",
      path: ["targetEndDate"],
    },
  );

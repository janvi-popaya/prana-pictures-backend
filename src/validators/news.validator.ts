import * as z from "zod";

const optionalHttpUrl = z
  .string()
  .trim()
  .max(500)
  .refine(
    (value) =>
      value === "" || /^https?:\/\/\S+$/i.test(value),
    "Please provide a valid HTTP or HTTPS URL",
  )
  .optional();

export const createNewsSchema = z.strictObject({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200),

  url: optionalHttpUrl,

  description: z.string().trim().max(2000).optional(),

  sortOrder: z
    .number()
    .int("Sort order must be a whole number")
    .min(0, "Sort order cannot be negative")
    .default(0),

  status: z.enum(["enabled", "disabled"]).default("enabled"),
});

export const updateNewsSchema = createNewsSchema
  .partial()
  .refine(
    (body) => Object.keys(body).length > 0,
    "At least one field must be provided",
  );

export type CreateNewsInput = z.infer<typeof createNewsSchema>;
export type UpdateNewsInput = z.infer<typeof updateNewsSchema>;
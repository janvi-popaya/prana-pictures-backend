import * as z from "zod";

const metaTitleSchema = z
  .string()
  .trim()
  .min(1, "Meta title is required")
  .max(100);

const metaDescriptionSchema = z
  .string()
  .trim()
  .max(300)
  .optional();

const metaKeywordsSchema = z
  .array(z.string().trim().min(1).max(60))
  .max(20)
  .optional();

const createSeoSchema = z.strictObject({
  metaTitle: metaTitleSchema,
  metaDescription: metaDescriptionSchema,
  metaKeywords: metaKeywordsSchema,
});

const updateSeoSchema = z
  .strictObject({
    metaTitle: metaTitleSchema.optional(),
    metaDescription: metaDescriptionSchema,
    metaKeywords: metaKeywordsSchema,
  })
  .refine(
    (seo) => Object.keys(seo).length > 0,
    "At least one SEO field must be provided",
  );

const titleSchema = z
  .string()
  .trim()
  .min(1, "Title is required")
  .max(150);

const slugSchema = z
  .string()
  .trim()
  .min(1, "Slug is required")
  .max(150)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug must contain lowercase letters, numbers and hyphens only",
  );

const descriptionHtmlSchema = z
  .string()
  .trim()
  .max(10000)
  .optional();

const iconSchema = z.string().trim().max(100).optional();

const sortOrderSchema = z
  .number()
  .int("Sort order must be a whole number")
  .min(0, "Sort order cannot be negative");

const statusSchema = z.enum(["enabled", "disabled"]);

export const createInformationSchema = z.strictObject({
  title: titleSchema,
  slug: slugSchema,
  descriptionHtml: descriptionHtmlSchema,
  icon: iconSchema,
  showInFooter: z.boolean().default(false),
  sortOrder: sortOrderSchema.default(0),
  status: statusSchema.default("enabled"),
  seo: createSeoSchema,
});

export const updateInformationSchema = z
  .strictObject({
    title: titleSchema.optional(),
    slug: slugSchema.optional(),
    descriptionHtml: descriptionHtmlSchema,
    icon: iconSchema,
    showInFooter: z.boolean().optional(),
    sortOrder: sortOrderSchema.optional(),
    status: statusSchema.optional(),
    seo: updateSeoSchema.optional(),
  })
  .refine(
    (body) => Object.keys(body).length > 0,
    "At least one field must be provided",
  );

export type CreateInformationInput = z.infer<
  typeof createInformationSchema>;

export type UpdateInformationInput = z.infer<
  typeof updateInformationSchema>;
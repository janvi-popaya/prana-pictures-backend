import * as z from "zod";

const optionalHttpUrl=z.string().trim().max(500).refine((value)=>value===""|| /^https?:\/\/\S+$/i.test(value),"Please provide a valid HTTP or HTTPS URL",).optional();
const socialLinkSchema = z.strictObject({
  platform: z.string().trim().min(1).max(50),

  url: z
    .string()
    .trim()
    .refine(
      (value) => /^https?:\/\/\S+$/i.test(value),
      "Please provide a valid social media URL",
    ),

  sortOrder: z.number().int().min(0).default(0),
});

const seoSchema = z.strictObject({
  metaTitle: z.string().trim().max(100).optional(),
  metaDescription: z.string().trim().max(200).optional(),
  metaKeywords: z
    .array(z.string().trim().min(1).max(60))
    .max(20)
    .optional(),
});

export const createFilmSchema=z.strictObject({
    imdbUrl: optionalHttpUrl,
    letterboxdUrl: optionalHttpUrl,
    trailerUrl: optionalHttpUrl,
    title:z.string().trim().min(1,"Title is required").max(100),
    slug:z.string().trim().min(1,"Slug is required").max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/,"Slug must contain lowercase letters, numbers and hyphens only"),
    descriptionHtml:z.string().trim().min(1,"Description is required").max(5000),
    shortDescription:z.string().trim().max(500).optional(),
    genres:z.array(z.string().trim().min(1).max(50)).min(1,"At least one genre is required").max(20),
    cast:z.string().trim().max(2000).optional(),
    directedBy:z.string().trim().max(200).optional(),
    writtenBy:z.string().trim().max(500).optional(),
    musicBy:z.string().trim().max(500).optional(),
    producedBy:z.string().trim().max(300).optional(),
    releaseAndScreening:z.string().trim().max(5000).optional(),
    awards:z.string().trim().max(2000).optional(),
    language:z.string().trim().max(100).optional(),
    basedOn:z.string().trim().max(200).optional(),
    releaseDate:z.iso.date(),
    runtimeMinutes:z.number().int().min(1,"Runtime must be at least one minute"),
    sortOrder:z.number().int("Sort must be a whole number").min(0,"Sort order cannot be negative"),
    status:z.enum(["enabled","disabled","upcoming"]),
    socialLinks:z.array(socialLinkSchema).max(20).optional(),
    seo:seoSchema.optional(),
});

export const updateFilmSchema = createFilmSchema
  .partial()
  .refine(
    (body) => Object.keys(body).length > 0,
    "At least one field must be provided",
  );

export type CreateFilmInput = z.infer<typeof createFilmSchema>;
export type UpdateFilmInput = z.infer<typeof updateFilmSchema>;

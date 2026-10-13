import * as z from "zod";

const optionalEmail=z.string().trim().max(254).refine((value)=>value===""||/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),"Please provide a valid email address",).optional();
const socialLinkSchema=z.strictObject({
    platform:z.string().trim().optional(),
    url:z.string().trim().refine((value) => /^https?:\/\/\S+$/i.test(value),
      "Please provide a valid social media URL",),
      sortOrder:z.number().int("Sort order must be whole number").min(0).default(0),
});

const skillsSchema = z.strictObject({
  technicalSolutioning: z.number().int().min(0).max(100).default(0),
  projectManagement: z.number().int().min(0).max(100).default(0),
  businessDevelopment: z.number().int().min(0).max(100).default(0),
  peopleManagement: z.number().int().min(0).max(100).default(0),
});

export const createTeamMemberSchema=z.strictObject({
    name:z.string().trim().min(1,"Name is required").max(100),
    shortBio: z.string().trim().max(500).optional(),
    descriptionHtml: z.string().trim().max(5000).optional(),
    designation: z
    .string()
    .trim()
    .min(1, "Designation is required")
    .max(150),
    email: optionalEmail,
    sortOrder: z
      .number()
      .int("Sort order must be a whole number")
      .min(0)
      .default(0),
    status: z.enum(["enabled", "disabled"]).default("enabled"),
    socialLinks: z.array(socialLinkSchema).max(20).optional(),
    skills: skillsSchema.optional(),
});

export const updateTeamMemberSchema = createTeamMemberSchema
  .partial()
  .refine(
    (body) => Object.keys(body).length > 0,
    "At least one field must be provided",
  );

export type CreateTeamMemberInput = z.infer<
  typeof createTeamMemberSchema
>;

export type UpdateTeamMemberInput = z.infer<
  typeof updateTeamMemberSchema
>;
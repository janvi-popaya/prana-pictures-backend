import * as z from "zod";

export const mediaFolders = [
  "films/posters",
  "films/heroes",
  "films/stills",
  "films/bts",
  "films/events",
  "team",
  "news",
  "information",
  "banners",
  "videos",
] as const;

export const allowedMediaTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "video/mp4",
  "video/webm",
  "video/quicktime",
] as const;

export const presignUploadSchema = z.strictObject({
  fileName: z
    .string()
    .trim()
    .min(1, "File name is required")
    .max(255),

  contentType: z.enum(allowedMediaTypes),

  folder: z.enum(mediaFolders),

  // The API records the size but intentionally imposes no maximum.
  fileSize: z.number().int().positive().optional(),
});

export type PresignUploadInput = z.infer<
  typeof presignUploadSchema
>;

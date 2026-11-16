import { randomUUID } from "node:crypto";
import type {
  NextFunction,
  Request,
  Response,
} from "express";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  createPublicMediaUrl,
  s3Bucket,
  s3Client,
} from "../config/s3.js";
import type { PresignUploadInput } from "../validators/media.validator.js";

const extensionByContentType = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
} as const;

function createSafeFileName(fileName: string) {
  const nameWithoutExtension = fileName.replace(/\.[^/.]+$/, "");

  const safeName = nameWithoutExtension
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return safeName || "media";
}

export async function createPresignedUpload(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const {
      fileName,
      contentType,
      folder,
    } = req.body as PresignUploadInput;

    const extension = extensionByContentType[contentType];
    const safeFileName = createSafeFileName(fileName);
    const dateFolder = new Date().toISOString().slice(0, 10);

    const objectKey = [
      folder,
      dateFolder,
      `${safeFileName}-${randomUUID()}.${extension}`,
    ].join("/");

    const command = new PutObjectCommand({
      Bucket: s3Bucket,
      Key: objectKey,
      ContentType: contentType,
    });

    const expiresInSeconds = 15 * 60;

    const uploadUrl = await getSignedUrl(s3Client, command, {
      expiresIn: expiresInSeconds,
    });

    return res.status(200).json({
      success: true,
      message: "Upload URL created successfully",
      data: {
        uploadUrl,
        method: "PUT",
        headers: {
          "Content-Type": contentType,
        },
        objectKey,
        publicUrl: createPublicMediaUrl(objectKey),
        expiresInSeconds,
      },
    });
  } catch (error) {
    next(error);
  }
}

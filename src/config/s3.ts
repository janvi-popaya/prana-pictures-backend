import { S3Client } from "@aws-sdk/client-s3";

function getRequiredEnvironmentVariable(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} must be configured`);
  }

  return value;
}

export const s3Bucket = getRequiredEnvironmentVariable(
  "S3_BUCKET",
);

export const s3PublicBaseUrl =
  getRequiredEnvironmentVariable(
    "S3_PUBLIC_BASE_URL",
  ).replace(/\/+$/, "");

export const s3Client = new S3Client({
  endpoint: getRequiredEnvironmentVariable("S3_ENDPOINT"),

  region: getRequiredEnvironmentVariable("S3_REGION"),

  // SeaweedFS validates checksums supplied on presigned uploads. The AWS SDK
  // cannot know the browser-selected file body while it creates the URL, so
  // avoid adding an optional checksum for an empty body to the signature.
  requestChecksumCalculation: "WHEN_REQUIRED",
  responseChecksumValidation: "WHEN_REQUIRED",

  forcePathStyle:
    process.env.S3_FORCE_PATH_STYLE?.toLowerCase() === "true",

  credentials: {
    accessKeyId: getRequiredEnvironmentVariable(
      "AWS_ACCESS_KEY_ID",
    ),

    secretAccessKey: getRequiredEnvironmentVariable(
      "AWS_SECRET_ACCESS_KEY",
    ),
  },
});

export function createPublicMediaUrl(objectKey: string) {
  const encodedKey = objectKey
    .split("/")
    .map(encodeURIComponent)
    .join("/");

  return `${s3PublicBaseUrl}/${encodedKey}`;
}

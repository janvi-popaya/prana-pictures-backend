import "dotenv/config";
import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import {
  s3Bucket,
  s3Client,
} from "../config/s3.js";

async function testS3Connection() {
  try {
    const result = await s3Client.send(
      new ListObjectsV2Command({
        Bucket: s3Bucket,
        MaxKeys: 5,
      }),
    );

    console.log("SeaweedFS connection successful");
    console.log(`Bucket: ${s3Bucket}`);
    console.log(`Objects found: ${result.KeyCount ?? 0}`);

    for (const object of result.Contents ?? []) {
      console.log(`- ${object.Key}`);
    }
  } catch (error) {
    console.error("SeaweedFS connection failed:", error);
    process.exit(1);
  }
}

testS3Connection();
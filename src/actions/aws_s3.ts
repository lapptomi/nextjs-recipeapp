"use server";

import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const region = process.env.AWS_BUCKET_REGION as string;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID as any;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY as string;
const bucketName = process.env.AWS_BUCKET_NAME as string;

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export const uploadImageToS3 = async (image: File) => {
  const uploadCommand = new PutObjectCommand({
    Bucket: bucketName,
    Key: image.name,
    Body: Buffer.from(await image.arrayBuffer()),
    ContentType: image.type,
  });

  const uploadedImage = await s3Client.send(uploadCommand);
  return uploadedImage;
};

export const getSignedImageUrl = async (imageName: string) => {
  if (!imageName) {
    return undefined;
  }

  const getObjectCommand = new GetObjectCommand({
    Bucket: bucketName,
    Key: imageName,
  });

  const signedUrl = await getSignedUrl(s3Client, getObjectCommand, {
    expiresIn: 3600, // URL expiration time in seconds
  });

  return signedUrl;
};
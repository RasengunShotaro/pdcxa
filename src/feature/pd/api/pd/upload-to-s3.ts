import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const accessKey = process.env.S3_ACCESS_KEY;
const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
const endpoint = process.env.S3_ENDPOINT;
const bucketName = process.env.S3_BUCKET_NAME;

if (!accessKey || !secretAccessKey || !endpoint || !bucketName) {
  throw new Error("S3の環境変数が設定されていません");
}

const s3 = new S3Client({
  region: "auto",
  endpoint,
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
  requestChecksumCalculation: "WHEN_REQUIRED",
});

export const uploadToS3 = async ({
  body,
  fileName,
  contentType,
  extension,
}: {
  body: Uint8Array | Blob;
  fileName: string;
  contentType: string;
  extension: string;
}) => {
  const fullFileName = `${fileName}.${extension}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: fullFileName,
    Body: body,
    ContentType: contentType,
  });

  await s3.send(command);

  const baseUrl = endpoint.replace("https://", "");
  return `https://${bucketName}.${baseUrl}/${fullFileName}`;
};

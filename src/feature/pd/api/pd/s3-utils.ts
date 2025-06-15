"use server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

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

  const R2 = getCloudflareContext().env.R2;
  await R2.put(fullFileName, body, {
    httpMetadata: {
      contentType,
    },
  });

  return fullFileName;
};

export const getFromS3 = async (fullFileName: string) => {
  const R2 = getCloudflareContext().env.R2;
  const response = await R2.get(fullFileName);

  const data = await new Response(response?.body).arrayBuffer();

  if (!data) {
    throw new Error("画像データ取得に失敗しました");
  }

  return data;
};

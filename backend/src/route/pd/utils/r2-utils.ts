import type { Context } from "hono";
import type { Bindings } from "@/lib/bindings";

export const R2に画像をアップロードする = async ({
  body,
  fileName,
  contentType,
  extension,
  c,
}: {
  body: Uint8Array | Blob;
  fileName: string;
  contentType: string;
  extension: string;
  c: Context<Bindings>;
}) => {
  const fullFileName = `${fileName}.${extension}`;

  const R2 = c.env.R2;
  await R2.put(fullFileName, body, {
    httpMetadata: {
      contentType,
    },
  });

  return fullFileName;
};

export const R2から指定した名前の画像を取得する = async ({
  fullFileName,
  c,
}: {
  fullFileName: string;
  c: Context<Bindings>;
}) => {
  const R2 = c.env.R2;
  const response = await R2.get(fullFileName);

  const data = await new Response(response?.body).arrayBuffer();

  if (!data) {
    throw new Error("画像データ取得に失敗しました");
  }

  return data;
};

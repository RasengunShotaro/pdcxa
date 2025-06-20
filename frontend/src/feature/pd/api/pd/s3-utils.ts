"use server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export const getFromS3 = async (fullFileName: string) => {
  const R2 = getCloudflareContext().env.R2;
  const response = await R2.get(fullFileName);

  const data = await new Response(response?.body).arrayBuffer();

  if (!data) {
    throw new Error("画像データ取得に失敗しました");
  }

  return data;
};

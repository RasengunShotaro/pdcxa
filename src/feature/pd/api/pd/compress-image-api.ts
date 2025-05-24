import { client } from "@/lib/hono";

export const compressImageApi = async ({ image }: { image: File }) => {
  const res = await client.api["compress-image"].$post({
    form: {
      image,
    },
  });
  if (!res.ok) {
    throw new Error("画像の圧縮に失敗しました");
  }
  return await res.blob();
};

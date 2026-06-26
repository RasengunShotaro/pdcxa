import { createGifPd as createGifPdApi } from "@/schema/api";

export const createGifPd = async ({
  content,
  image,
}: {
  content: string;
  image: File;
}) => {
  return (await createGifPdApi({ content, image })).data;
};

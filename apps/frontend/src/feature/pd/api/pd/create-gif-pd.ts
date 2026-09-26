import { ApiError } from "@/lib/api-error";
import { createGifPd as createGifPdApi } from "@/schema/api";

export const createGifPd = async ({
  content,
  image,
  quotedPdId,
}: {
  content: string;
  image: File;
  quotedPdId?: string;
}) => {
  const response = await createGifPdApi({ content, image, quotedPdId });
  if (response.status !== 201) {
    throw new ApiError(response.status);
  }
  return response.data;
};

import { ApiError } from "@/lib/api-error";
import { createPd as createPdApi } from "@/schema/api";

export const createPd = async ({
  content,
  image,
  quotedPdId,
}: {
  content: string;
  image?: File;
  quotedPdId?: string;
}) => {
  const response = await createPdApi({ content, image, quotedPdId });
  if (response.status !== 201) {
    throw new ApiError(response.status);
  }
  return response.data;
};

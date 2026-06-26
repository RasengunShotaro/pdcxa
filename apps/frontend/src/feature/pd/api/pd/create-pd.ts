import { createPd as createPdApi } from "@/schema/api";

export const createPd = async ({
  content,
  image,
}: {
  content: string;
  image?: File;
}) => {
  return (await createPdApi({ content, image })).data;
};

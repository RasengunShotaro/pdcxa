import { createPd as createPdApi } from "@/schema/api";

export const createPd = async ({
  content,
  image,
}: {
  content: string;
  image?: File;
}) => {
  await createPdApi({ content, image });
};

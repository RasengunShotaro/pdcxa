import { createRePd as createRePdApi } from "@/schema/api";

export const createRePd = async ({
  pdId,
  content,
}: {
  pdId: string;
  content: string;
}) => {
  await createRePdApi({ pdId, content });
};

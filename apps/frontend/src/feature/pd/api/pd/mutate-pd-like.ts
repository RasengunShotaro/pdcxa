import { mutatePdLike as mutatePdLikeApi } from "@/schema/api";

export const mutatePdLike = async (pdId: string) => {
  await mutatePdLikeApi({ pdId });
};

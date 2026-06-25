import { mutateRePdLike as mutateRePdLikeApi } from "@/schema/api";

export const mutateRePdLike = async (rePdId: string) => {
  await mutateRePdLikeApi({ rePdId });
};

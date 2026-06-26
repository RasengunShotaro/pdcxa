import type { AuthUser } from "@/lib/auth/types";
import type { Pd, RawPd } from "../types/pd";

export const 作成したPDを詳細化する = ({
  created,
  user,
}: {
  created: RawPd;
  user: AuthUser | null;
}): Pd => {
  const userFullName =
    user?.fullName ?? `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();

  return {
    ...created,
    userDetail: {
      id: user?.id ?? created.userId,
      userFullName,
      imageUrl: user?.imageUrl ?? "",
      userName: "",
    },
    likeUserNames: [],
    likeUsers: [],
  };
};

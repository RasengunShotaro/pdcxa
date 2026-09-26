import type { AuthUser } from "@/lib/auth/types";
import type { Pd, QuotedPd, RawPd } from "../types/pd";

export const 作成したPDを詳細化する = ({
  created,
  user,
  quotedFrom,
}: {
  created: RawPd;
  user: AuthUser | null;
  quotedFrom?: QuotedPd;
}): Pd => {
  const userFullName =
    user?.fullName ?? `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();

  return {
    ...created,
    quotedPd:
      created.quotedPd && quotedFrom?.id === created.quotedPd.id
        ? { ...created.quotedPd, userDetail: quotedFrom.userDetail }
        : null,
    userDetail: {
      id: user?.id ?? created.userId,
      userFullName,
      imageUrl: user?.imageUrl ?? "",
      userName: user?.userName ?? "",
    },
    likeUserNames: [],
    likeUsers: [],
  };
};

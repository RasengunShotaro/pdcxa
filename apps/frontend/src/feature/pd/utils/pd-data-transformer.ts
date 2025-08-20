import type { Pd, RawPd, UserDetail } from "../types/pd";

export const ユーザーIDリストを抽出する = (pds: RawPd[]): string[] => {
  const allUserIds = pds.flatMap((pd) => {
    const likeUserIds = pd.likes.map((like) => like.userId);
    return [pd.userId, ...likeUserIds];
  });
  return [...new Set(allUserIds)];
};

const ユーザー詳細情報のMapを作成する = (
  userDetails: UserDetail[],
): Map<string, UserDetail> => {
  return new Map(userDetails.map((user) => [user.id, user]));
};

const ユーザーのフルネームをフォーマットする = (
  userDetail?: UserDetail,
): string => {
  return `${userDetail?.firstName ?? ""} ${userDetail?.lastName ?? ""}`.trim();
};

const いいねユーザーの名前リストを作成する = (
  likes: { userId: string }[],
  userDetailsMap: Map<string, UserDetail>,
): string[] => {
  return likes.map((like) => {
    const likeUserDetail = userDetailsMap.get(like.userId);
    return ユーザーのフルネームをフォーマットする(likeUserDetail);
  });
};

export const PDを詳細化する = (
  pds: RawPd[],
  userDetails: UserDetail[],
): Pd[] => {
  const userDetailsMap = ユーザー詳細情報のMapを作成する(userDetails);
  return pds.map((pd) => {
    const userDetail = userDetailsMap.get(pd.userId);
    const userFullName = ユーザーのフルネームをフォーマットする(userDetail);
    const likeUserNames = いいねユーザーの名前リストを作成する(
      pd.likes,
      userDetailsMap,
    );
    return {
      ...pd,
      userDetail: {
        id: userDetail?.id ?? "",
        userFullName,
        imageUrl: userDetail?.imageUrl ?? "",
        userName: userDetail?.userName ?? "",
      },
      likeUserNames,
    };
  });
};

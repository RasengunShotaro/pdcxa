import type {
  LikeUser,
  Pd,
  QuotedPd,
  RawPd,
  RawQuotedPd,
  UserDetail,
} from "../types/pd";

export const ユーザーIDリストを抽出する = (pds: RawPd[]): string[] => {
  const allUserIds = pds.flatMap((pd) => {
    const likeUserIds = pd.likes.map((like) => like.userId);
    const quotedAuthorIds = pd.quotedPd ? [pd.quotedPd.userId] : [];
    return [pd.userId, ...likeUserIds, ...quotedAuthorIds];
  });
  return [...new Set(allUserIds)];
};

const 引用元を詳細化する = (
  quotedPd: RawQuotedPd | null,
  userDetailsMap: Map<string, UserDetail>,
): QuotedPd | null => {
  if (!quotedPd) {
    return null;
  }
  const author = userDetailsMap.get(quotedPd.userId);
  return {
    ...quotedPd,
    userDetail: {
      userFullName: ユーザーのフルネームをフォーマットする(author),
      imageUrl: author?.imageUrl ?? "",
      userName: author?.userName ?? "",
    },
  };
};

export const ユーザー詳細情報のMapを作成する = (
  userDetails: UserDetail[],
): Map<string, UserDetail> => {
  return new Map(userDetails.map((user) => [user.id, user]));
};

export const ユーザーのフルネームをフォーマットする = (
  userDetail?: UserDetail,
): string => {
  return `${userDetail?.firstName ?? ""} ${userDetail?.lastName ?? ""}`.trim();
};

export const いいねユーザーの名前リストを作成する = (
  likes: { userId: string }[],
  userDetailsMap: Map<string, UserDetail>,
): string[] => {
  return likes.map((like) => {
    const likeUserDetail = userDetailsMap.get(like.userId);
    return ユーザーのフルネームをフォーマットする(likeUserDetail);
  });
};

export const いいねユーザーの詳細リストを作成する = (
  likes: { userId: string }[],
  userDetailsMap: Map<string, UserDetail>,
): LikeUser[] => {
  return likes.map((like) => {
    const likeUserDetail = userDetailsMap.get(like.userId);
    return {
      userId: like.userId,
      userFullName: ユーザーのフルネームをフォーマットする(likeUserDetail),
      imageUrl: likeUserDetail?.imageUrl ?? "",
      userName: likeUserDetail?.userName ?? "",
    };
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
    const likeUsers = いいねユーザーの詳細リストを作成する(
      pd.likes,
      userDetailsMap,
    );
    return {
      ...pd,
      quotedPd: 引用元を詳細化する(pd.quotedPd, userDetailsMap),
      userDetail: {
        id: userDetail?.id ?? "",
        userFullName,
        imageUrl: userDetail?.imageUrl ?? "",
        userName: userDetail?.userName ?? "",
      },
      likeUserNames,
      likeUsers,
    };
  });
};

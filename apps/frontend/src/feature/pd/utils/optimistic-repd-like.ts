import type { LikeUser, RePd } from "../types";

export const optimisticToggleRePdLike = ({
  rePds,
  rePdId,
  myUserId,
  myLikeUser,
}: {
  rePds: RePd[];
  rePdId: string;
  myUserId: string;
  myLikeUser: LikeUser;
}): RePd[] =>
  rePds.map((rePd) => {
    if (rePd.id !== rePdId) return rePd;

    const isLiked = rePd.likes.some((like) => like.userId === myUserId);

    return {
      ...rePd,
      likes: isLiked
        ? rePd.likes.filter((like) => like.userId !== myUserId)
        : [...rePd.likes, { userId: myUserId }],
      likeUsers: isLiked
        ? rePd.likeUsers.filter((user) => user.userId !== myUserId)
        : [...rePd.likeUsers, myLikeUser],
      likeCount: isLiked
        ? Number(rePd.likeCount) - 1
        : Number(rePd.likeCount) + 1,
    };
  });

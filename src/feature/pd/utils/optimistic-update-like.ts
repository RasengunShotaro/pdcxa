import type { QueryClient } from "@tanstack/react-query";
import type { Pd } from "../types";

export const optimisticUpdateLike = async ({
  pd,
  queryKey,
  queryClient,
  myUserId,
}: {
  pd: Pd;
  queryKey: (string | null)[];
  queryClient: QueryClient;
  myUserId: string;
}) => {
  const previousPds = queryClient.getQueryData<Pd[]>(queryKey);

  queryClient.setQueryData<Pd[]>(queryKey, (oldPds) => {
    if (!oldPds) return oldPds;

    return oldPds.map((oldPd) => {
      if (oldPd.id !== pd.id) return oldPd;

      const isCurrentlyLiked = oldPd.likes.some(
        (like) => like.userId === myUserId
      );
      const updatedLikes = isCurrentlyLiked
        ? oldPd.likes.filter((like) => like.userId !== myUserId)
        : [...oldPd.likes, { userId: myUserId }];

      return {
        ...oldPd,
        likes: updatedLikes,
        likeCount: isCurrentlyLiked
          ? Number(oldPd.likeCount) - 1
          : Number(oldPd.likeCount) + 1,
      };
    });
  });

  return { previousPds };
};

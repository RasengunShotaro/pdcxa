import type { InfiniteData, QueryClient } from "@tanstack/react-query";
import type { Pd } from "../types";

type InfinitePds = {
  items: Pd[];
  nextCursor?: string;
};

export const optimisticUpdateLike = async ({
  pd,
  queryKey,
  queryClient,
  myUserId,
}: {
  pd: Pd;
  queryKey: (string | undefined)[];
  queryClient: QueryClient;
  myUserId: string;
}) => {
  const previousPages =
    queryClient.getQueryData<InfiniteData<InfinitePds>>(queryKey);

  queryClient.setQueryData<InfiniteData<InfinitePds>>(queryKey, (oldPages) => {
    if (!oldPages) return oldPages;

    return {
      ...oldPages,
      pages: oldPages.pages.map((oldPage) => {
        return {
          ...oldPage,
          items: oldPage.items.map((oldPd) => {
            if (oldPd.id !== pd.id) return oldPd;

            const isCurrentlyLiked = oldPd.likes.some(
              (like) => like.userId === myUserId,
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
          }),
        };
      }),
    };
  });

  return { previousPages };
};

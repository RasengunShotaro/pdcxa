import type {
  InfiniteData,
  QueryClient,
  QueryKey,
} from "@tanstack/react-query";
import { isPdDetailQueryKey } from "../api/query-keys";
import type { LikeUser, Pd } from "../types";

type InfinitePds = {
  items: Pd[];
  nextCursor?: string;
};

export type PdDetailSnapshot = Array<
  [QueryKey, InfiniteData<InfinitePds> | undefined]
>;

const togglePdLike = ({
  page,
  pd,
  myUserId,
  myLikeUser,
}: {
  page: InfinitePds;
  pd: Pd;
  myUserId: string;
  myLikeUser: LikeUser;
}): InfinitePds => ({
  ...page,
  items: page.items.map((oldPd) => {
    if (oldPd.id !== pd.id) return oldPd;

    const isCurrentlyLiked = oldPd.likes.some(
      (like) => like.userId === myUserId,
    );
    const updatedLikes = isCurrentlyLiked
      ? oldPd.likes.filter((like) => like.userId !== myUserId)
      : [...oldPd.likes, { userId: myUserId }];
    const updatedLikeUsers = isCurrentlyLiked
      ? oldPd.likeUsers.filter((user) => user.userId !== myUserId)
      : [...oldPd.likeUsers, myLikeUser];

    return {
      ...oldPd,
      likes: updatedLikes,
      likeUsers: updatedLikeUsers,
      likeCount: isCurrentlyLiked
        ? Number(oldPd.likeCount) - 1
        : Number(oldPd.likeCount) + 1,
    };
  }),
});

export const optimisticUpdateLike = async ({
  pd,
  queryClient,
  myUserId,
  myLikeUser,
}: {
  pd: Pd;
  queryClient: QueryClient;
  myUserId: string;
  myLikeUser: LikeUser;
}): Promise<{ previousQueries: PdDetailSnapshot }> => {
  const filters = {
    predicate: ({ queryKey }: { queryKey: QueryKey }) =>
      isPdDetailQueryKey(queryKey),
  } as const;

  const previousQueries =
    queryClient.getQueriesData<InfiniteData<InfinitePds>>(filters);

  queryClient.setQueriesData<InfiniteData<InfinitePds>>(filters, (oldPages) => {
    if (!oldPages) return oldPages;

    return {
      ...oldPages,
      pages: oldPages.pages.map((oldPage) =>
        togglePdLike({ page: oldPage, pd, myUserId, myLikeUser }),
      ),
    };
  });

  return { previousQueries };
};

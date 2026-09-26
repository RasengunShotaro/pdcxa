import type {
  InfiniteData,
  QueryClient,
  QueryKey,
} from "@tanstack/react-query";
import { isPdDetailQueryKey } from "../api/query-keys";
import type { Pd } from "../types";
import type { PdDetailSnapshot } from "./optimistic-update-like";

type InfinitePds = {
  items: Pd[];
  nextCursor?: string;
};

interface Pdの保存状態を差し替えるInput {
  pages: InfiniteData<InfinitePds>;
  pdId: string;
  bookmarked: boolean;
}

export const PDの保存状態を差し替える = ({
  pages,
  pdId,
  bookmarked,
}: Pdの保存状態を差し替えるInput): InfiniteData<InfinitePds> => ({
  ...pages,
  pages: pages.pages.map((page) => ({
    ...page,
    items: page.items.map((pd) =>
      pd.id === pdId ? { ...pd, isBookmarked: bookmarked } : pd,
    ),
  })),
});

interface OptimisticUpdateBookmarkInput {
  queryClient: QueryClient;
  pdId: string;
  bookmarked: boolean;
}

export const optimisticUpdateBookmark = async ({
  queryClient,
  pdId,
  bookmarked,
}: OptimisticUpdateBookmarkInput): Promise<{
  previousQueries: PdDetailSnapshot;
}> => {
  const filters = {
    predicate: ({ queryKey }: { queryKey: QueryKey }) =>
      isPdDetailQueryKey(queryKey),
  } as const;

  await queryClient.cancelQueries(filters);

  const previousQueries =
    queryClient.getQueriesData<InfiniteData<InfinitePds>>(filters);

  queryClient.setQueriesData<InfiniteData<InfinitePds>>(filters, (pages) =>
    pages ? PDの保存状態を差し替える({ pages, pdId, bookmarked }) : pages,
  );

  return { previousQueries };
};

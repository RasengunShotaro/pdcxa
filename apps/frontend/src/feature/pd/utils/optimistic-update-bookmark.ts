import type { InfiniteData, QueryClient } from "@tanstack/react-query";
import {
  type InfinitePds,
  type PdDetailSnapshot,
  pdDetailQueryFilters,
} from "./optimistic-update-like";

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
  await queryClient.cancelQueries(pdDetailQueryFilters);

  const previousQueries =
    queryClient.getQueriesData<InfiniteData<InfinitePds>>(pdDetailQueryFilters);

  queryClient.setQueriesData<InfiniteData<InfinitePds>>(
    pdDetailQueryFilters,
    (pages) =>
      pages ? PDの保存状態を差し替える({ pages, pdId, bookmarked }) : pages,
  );

  return { previousQueries };
};

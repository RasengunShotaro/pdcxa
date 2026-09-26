"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchDetailedBookmarkedPds } from "@/feature/pd/api/pd/fetch-detailed-bookmarked-pds";
import { bookmarkedPdsQueryKey } from "@/feature/pd/api/query-keys";
import type { Pd } from "@/feature/pd/types";

export const useBookmarkedPds = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isPending,
    isFetchingNextPage,
    isError,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey: bookmarkedPdsQueryKey(),
    queryFn: ({ pageParam: cursor }) => fetchDetailedBookmarkedPds({ cursor }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    refetchOnMount: true,
  });

  const pds: Pd[] = data?.pages.flatMap((page) => page.items) ?? [];

  return {
    pds,
    isPending,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  };
};

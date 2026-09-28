"use client";

import {
  infiniteQueryOptions,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { createPd } from "@/feature/pd/api/pd/create-pd";
import { fetchDetailedPds } from "@/feature/pd/api/pd/fetch-detailed-pds";
import { pdDetailQueryKey, pdRootQueryKey } from "@/feature/pd/api/query-keys";
import type { Pd } from "@/feature/pd/types";
import { legacyDelay } from "@/utils/legacy-delay";

interface PdQueryTarget {
  pdId?: string;
  userName?: string;
}

export const pdListQueryOptions = ({ pdId, userName }: PdQueryTarget) =>
  infiniteQueryOptions({
    queryKey: pdDetailQueryKey({ pdId, userName }),
    queryFn: async ({ pageParam: cursor }) => {
      await legacyDelay();
      return await fetchDetailedPds({ pdId, userName, cursor });
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

export const usePd = ({ pdId, userName }: PdQueryTarget) => {
  const queryClient = useQueryClient();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isPending,
    isFetchingNextPage,
    isError,
    error,
    refetch,
  } = useInfiniteQuery(pdListQueryOptions({ pdId, userName }));

  const {
    mutateAsync: createNewPd,
    isPending: isMutationPending,
    isError: isMutationError,
  } = useMutation({
    mutationFn: async ({
      content,
      image,
    }: {
      content: string;
      image?: File;
    }) => {
      await legacyDelay();
      await createPd({ content, image });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pdRootQueryKey() });
    },
  });

  const pds: Pd[] = data?.pages.flatMap((page) => page.items) ?? [];

  return {
    pds,
    isPending,
    isError,
    error,
    createPd: createNewPd,
    isMutationPending,
    isMutationError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  };
};

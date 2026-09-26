"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { mutatePdBookmark } from "@/feature/pd/api/pd/mutate-pd-bookmark";
import { bookmarkedPdsQueryKey } from "@/feature/pd/api/query-keys";
import type { Pd } from "@/feature/pd/types";
import { optimisticUpdateBookmark } from "@/feature/pd/utils/optimistic-update-bookmark";
import type { PdDetailSnapshot } from "@/feature/pd/utils/optimistic-update-like";
import { errorDisplay } from "@/lib/error-message";

export const usePdBookmark = ({ pd }: { pd: Pd }) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation<
    void,
    unknown,
    boolean,
    { previousQueries?: PdDetailSnapshot }
  >({
    mutationFn: (bookmarked) => mutatePdBookmark({ pdId: pd.id, bookmarked }),
    onMutate: (bookmarked) =>
      optimisticUpdateBookmark({ queryClient, pdId: pd.id, bookmarked }),
    onError: (error, _bookmarked, context) => {
      for (const [key, data] of context?.previousQueries ?? []) {
        queryClient.setQueryData(key, data);
      }
      toast.warning(errorDisplay(error).message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: bookmarkedPdsQueryKey() });
    },
  });

  return {
    isBookmarked: pd.isBookmarked,
    toggleBookmark: () => mutate(!pd.isBookmarked),
    isPending,
  };
};

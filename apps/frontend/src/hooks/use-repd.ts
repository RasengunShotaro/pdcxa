"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  pdDetailQueryKey,
  rePdDetailQueryKey,
} from "@/feature/pd/api/query-keys";
import { createRePd } from "@/feature/pd/api/repd/create-repd";
import { fetchDetailedRepds } from "@/feature/pd/api/repd/fetch-detailed-repds";
import { legacyDelay } from "@/utils/legacy-delay";

export const useRePd = (pdId: string) => {
  const queryClient = useQueryClient();

  const {
    data: rePds = [],
    isPending,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: rePdDetailQueryKey(pdId),
    queryFn: async () => {
      await legacyDelay();
      return await fetchDetailedRepds(pdId);
    },
  });

  const { mutateAsync: createNewRePd, isPending: isCreating } = useMutation({
    mutationFn: async (content: string) => {
      await legacyDelay();
      await createRePd({ pdId, content });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rePdDetailQueryKey(pdId) });
      queryClient.invalidateQueries({ queryKey: pdDetailQueryKey({ pdId }) });
      queryClient.refetchQueries({
        queryKey: pdDetailQueryKey(),
        exact: true,
        type: "all",
      });
    },
  });

  return {
    rePds,
    isPending,
    isError,
    error,
    refetch,
    createRePd: createNewRePd,
    isCreating,
  };
};

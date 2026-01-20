"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mutatePdLike } from "@/feature/pd/api/pd/mutate-pd-like";
import type { Pd } from "@/feature/pd/types";
import { optimisticUpdateLike } from "@/feature/pd/utils/optimistic-update-like";
import { legacyDelay } from "@/utils/legacy-delay";

export const usePdLike = ({
  pd,
  pdId,
  userId,
}: {
  pd: Pd;
  pdId?: string;
  userId?: string;
}) => {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const myUserId = user?.id ?? "";

  const queryKey = pdId
    ? ["PD詳細", pdId, undefined]
    : userId
      ? ["PD詳細", undefined, userId]
      : ["PD詳細", undefined, undefined];

  const { mutate: toggleLike } = useMutation({
    mutationFn: async () => {
      await legacyDelay();
      await mutatePdLike(pd.id);
    },
    onMutate: () =>
      optimisticUpdateLike({ pd, queryKey, queryClient, myUserId }),
    onError: (_, __, context) => {
      if (context?.previousPages) {
        queryClient.setQueryData(queryKey, context.previousPages);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKey });
    },
  });

  const isLiked = pd.likes.some((like) => like.userId === myUserId);

  return {
    isLiked,
    toggleLike,
  };
};

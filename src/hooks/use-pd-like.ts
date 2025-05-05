"use client";

import { mutatePdLike } from "@/feature/pd/api/pd/mutate-pd-like";
import type { Pd } from "@/feature/pd/types";
import { optimisticUpdateLike } from "@/feature/pd/utils/optimistic-update-like";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
    ? ["PD詳細", pdId, null]
    : userId
    ? ["PD詳細", null, userId]
    : ["PD詳細", null, null];

  const { mutate: toggleLike } = useMutation({
    mutationFn: () => mutatePdLike(pd.id),
    onMutate: () =>
      optimisticUpdateLike({ pd, queryKey, queryClient, myUserId }),
    onError: (_, __, context) => {
      if (context?.previousPds) {
        queryClient.setQueryData(queryKey, context.previousPds);
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

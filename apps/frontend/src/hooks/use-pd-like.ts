"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Pd } from "@/feature/pd/types";
import { buildLikeUser } from "@/feature/pd/utils/build-like-user";
import { createPdLikeMutationOptions } from "@/feature/pd/utils/pd-like-mutation-options";
import { useCurrentUser } from "@/lib/auth/use-current-user";

export const usePdLike = ({ pd }: { pd: Pd }) => {
  const queryClient = useQueryClient();
  const { user } = useCurrentUser();
  const myUserId = user?.id ?? "";
  const myLikeUser = buildLikeUser(user);

  const { mutate: toggleLike, isPending } = useMutation(
    createPdLikeMutationOptions({
      pd,
      queryClient,
      myUserId,
      myLikeUser,
    }),
  );

  const isLiked = pd.likes.some((like) => like.userId === myUserId);

  return {
    isLiked,
    toggleLike,
    isPending,
  };
};

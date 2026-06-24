"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mutateRePdLike } from "@/feature/pd/api/repd/mutate-repd-like";
import type { RePd } from "@/feature/pd/types";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { legacyDelay } from "@/utils/legacy-delay";

export const useRePdLike = (rePd: RePd) => {
  const queryClient = useQueryClient();
  const { user } = useCurrentUser();
  const userId = user?.id ?? "";

  const { mutate: toggleLike } = useMutation({
    mutationFn: async () => {
      await legacyDelay();
      await mutateRePdLike(rePd.id);
    },
    onMutate: async () => {
      const previousRePds = queryClient.getQueryData<RePd[]>([
        "RePD詳細",
        rePd.pdId,
      ]);
      queryClient.setQueryData<RePd[]>(["RePD詳細", rePd.pdId], (oldRePds) => {
        if (!oldRePds) return oldRePds;

        return oldRePds.map((oldRePd) => {
          if (oldRePd.id !== rePd.id) return oldRePd;

          const isCurrentlyLiked = oldRePd.likes.some(
            (like) => like.userId === userId,
          );
          const updatedLikes = isCurrentlyLiked
            ? oldRePd.likes.filter((like) => like.userId !== userId)
            : [...oldRePd.likes, { userId }];

          return {
            ...oldRePd,
            likes: updatedLikes,
            likeCount: isCurrentlyLiked
              ? Number(oldRePd.likeCount) - 1
              : Number(oldRePd.likeCount) + 1,
          };
        });
      });

      return { previousRePds };
    },
    onError: (_, __, context) => {
      if (context?.previousRePds) {
        queryClient.setQueryData(
          ["RePD詳細", rePd.pdId],
          context.previousRePds,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["RePD詳細", rePd.pdId] });
    },
  });

  const isLiked = rePd.likes.some((like) => like.userId === userId);

  return {
    isLiked,
    toggleLike,
  };
};

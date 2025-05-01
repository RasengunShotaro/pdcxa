"use client";

import { mutatePdLike } from "@/feature/pd/api/pd/mutate-pd-like";
import type { Pd } from "@/feature/pd/types";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const usePdLike = (pd: Pd) => {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const userId = user?.id ?? "";

  const { mutate: toggleLike } = useMutation({
    mutationFn: () => mutatePdLike(pd.id),
    onMutate: async () => {
      const previousPds = queryClient.getQueryData<Pd[]>(["PD詳細"]);
      queryClient.setQueryData<Pd[]>(["PD詳細"], (oldPds) => {
        if (!oldPds) return oldPds;

        return oldPds.map((oldPd) => {
          if (oldPd.id !== pd.id) return oldPd;

          const isCurrentlyLiked = oldPd.likes.some(
            (like) => like.userId === userId
          );
          const updatedLikes = isCurrentlyLiked
            ? oldPd.likes.filter((like) => like.userId !== userId)
            : [...oldPd.likes, { userId }];

          return {
            ...oldPd,
            likes: updatedLikes,
            likeCount: isCurrentlyLiked
              ? oldPd.likeCount - 1
              : oldPd.likeCount + 1,
          };
        });
      });

      return { previousPds };
    },
    onError: (_, __, context) => {
      if (context?.previousPds) {
        queryClient.setQueryData(["PD詳細"], context.previousPds);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["PD詳細"] });
    },
  });

  const isLiked = pd.likes.some((like) => like.userId === userId);

  return {
    isLiked,
    toggleLike,
  };
};

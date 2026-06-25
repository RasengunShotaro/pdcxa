"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { rePdDetailQueryKey } from "@/feature/pd/api/query-keys";
import { mutateRePdLike } from "@/feature/pd/api/repd/mutate-repd-like";
import type { RePd } from "@/feature/pd/types";
import { buildLikeUser } from "@/feature/pd/utils/build-like-user";
import { optimisticToggleRePdLike } from "@/feature/pd/utils/optimistic-repd-like";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { errorDisplay } from "@/lib/error-message";
import { legacyDelay } from "@/utils/legacy-delay";

export const useRePdLike = (rePd: RePd) => {
  const queryClient = useQueryClient();
  const { user } = useCurrentUser();
  const myUserId = user?.id ?? "";
  const myLikeUser = buildLikeUser(user);
  const queryKey = rePdDetailQueryKey(rePd.pdId);

  const { mutate: toggleLike, isPending } = useMutation({
    mutationFn: async () => {
      await legacyDelay();
      await mutateRePdLike(rePd.id);
    },
    onMutate: async () => {
      const previousRePds = queryClient.getQueryData<RePd[]>(queryKey);
      queryClient.setQueryData<RePd[]>(queryKey, (oldRePds) =>
        oldRePds
          ? optimisticToggleRePdLike({
              rePds: oldRePds,
              rePdId: rePd.id,
              myUserId,
              myLikeUser,
            })
          : oldRePds,
      );
      return { previousRePds };
    },
    onError: (error, _, context) => {
      if (context?.previousRePds) {
        queryClient.setQueryData(queryKey, context.previousRePds);
      }
      toast.warning(errorDisplay(error).message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const isLiked = rePd.likes.some((like) => like.userId === myUserId);

  return {
    isLiked,
    toggleLike,
    isPending,
  };
};

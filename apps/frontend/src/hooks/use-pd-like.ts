"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { mutatePdLike } from "@/feature/pd/api/pd/mutate-pd-like";
import { pdDetailQueryKey } from "@/feature/pd/api/query-keys";
import type { Pd } from "@/feature/pd/types";
import { buildLikeUser } from "@/feature/pd/utils/build-like-user";
import { optimisticUpdateLike } from "@/feature/pd/utils/optimistic-update-like";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { errorDisplay } from "@/lib/error-message";
import { legacyDelay } from "@/utils/legacy-delay";

export const usePdLike = ({ pd }: { pd: Pd }) => {
  const queryClient = useQueryClient();
  const { user } = useCurrentUser();
  const myUserId = user?.id ?? "";
  const myLikeUser = buildLikeUser(user);

  const queryKey = pdDetailQueryKey();

  const { mutate: toggleLike, isPending } = useMutation({
    mutationFn: async () => {
      await legacyDelay();
      await mutatePdLike(pd.id);
    },
    onMutate: () =>
      optimisticUpdateLike({ pd, queryKey, queryClient, myUserId, myLikeUser }),
    onError: (error, __, context) => {
      if (context?.previousPages) {
        queryClient.setQueryData(queryKey, context.previousPages);
      }
      toast.warning(errorDisplay(error).message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKey });
    },
  });

  const isLiked = pd.likes.some((like) => like.userId === myUserId);

  return {
    isLiked,
    toggleLike,
    isPending,
  };
};

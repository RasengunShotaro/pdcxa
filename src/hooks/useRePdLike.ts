"use client";

import { fetchRePdLike } from "@/feature/pd/api/repd/fetch-repd-like";
import { mutateRePdLike } from "@/feature/pd/api/repd/mutate-repd-like";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useRePdLike = (rePdId: string) => {
  const queryClient = useQueryClient();
  const { user } = useUser();

  const { data: rePdLike = [], error } = useQuery({
    queryKey: ["RePDいいね", rePdId],
    queryFn: async () => fetchRePdLike(rePdId),
  });

  const { mutate } = useMutation({
    mutationFn: () => mutateRePdLike(user?.id ?? "", rePdId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["RePDいいね"] });
    },
  });

  return {
    rePdLike,
    error,
    mutateRePdLike: mutate,
  };
};

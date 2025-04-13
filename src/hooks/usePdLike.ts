"use client";

import { fetchPdLike } from "@/feature/pd/api/pd/fetch-pd-like";
import { mutatePdLike } from "@/feature/pd/api/pd/mutate-pd-like";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const usePdLike = (pdId: string) => {
  const queryClient = useQueryClient();
  const { user } = useUser();

  const { data: pdLike = [], error } = useQuery({
    queryKey: ["PDいいね", pdId],
    queryFn: async () => fetchPdLike(pdId),
  });

  const { mutate } = useMutation({
    mutationFn: () => mutatePdLike(user?.id ?? "", pdId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["PDいいね"] });
    },
  });

  return {
    pdLike,
    error,
    mutatePdLike: mutate,
  };
};

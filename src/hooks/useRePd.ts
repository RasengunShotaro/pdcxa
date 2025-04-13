"use client";

import { createRePd } from "@/feature/pd/api/repd/create-repd";
import { fetchRePds } from "@/feature/pd/api/repd/fetch-repds";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useRePd = (pdId: string) => {
  const queryClient = useQueryClient();
  const { user } = useUser();

  const { data: rePds = [], error } = useQuery({
    queryKey: ["RePD詳細", pdId],
    queryFn: async () => {
      const pds = await fetchRePds(pdId);
      return pds;
    },
  });

  const { mutate: createNewRePd } = useMutation({
    mutationFn: (pd: string) => createRePd(pdId, pd, user?.id ?? ""),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["RePD詳細", null],
        exact: true,
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["RePD詳細", [pdId]],
        exact: true,
      });
      queryClient.invalidateQueries({ queryKey: ["RePD詳細", pdId] });
    },
  });

  return {
    rePds,
    error,
    createRePd: createNewRePd,
  };
};

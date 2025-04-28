"use client";

import { createRePd } from "@/feature/pd/api/repd/create-repd";
import { fetchRePds } from "@/feature/pd/api/repd/fetch-repds";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useRePd = (pdId: string) => {
  const queryClient = useQueryClient();
  const { user } = useUser();

  const {
    data: rePds = [],
    isPending,
    error,
  } = useQuery({
    queryKey: ["RePD詳細", pdId],
    queryFn: async () => {
      const pds = await fetchRePds(pdId);
      return pds;
    },
  });

  const { mutate: createNewRePd } = useMutation({
    mutationFn: (pd: string) => createRePd(pdId, pd, user?.id ?? ""),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["RePD詳細", pdId] });
      queryClient.invalidateQueries({ queryKey: ["PD詳細", [pdId]] });
      queryClient.refetchQueries({
        queryKey: ["PD詳細", null, null],
        exact: true,
        type: "all",
      });
    },
  });

  return {
    rePds,
    isPending,
    error,
    createRePd: createNewRePd,
  };
};

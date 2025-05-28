"use client";

import { createRePd } from "@/feature/pd/api/repd/create-repd";
import { fetchDetailedRepds } from "@/feature/pd/api/repd/fetch-detailed-repds";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useRePd = (pdId: string) => {
  const queryClient = useQueryClient();

  const {
    data: rePds = [],
    isPending,
    error,
  } = useQuery({
    queryKey: ["RePD詳細", pdId],
    queryFn: () => fetchDetailedRepds(pdId),
  });

  const { mutate: createNewRePd } = useMutation({
    mutationFn: (pd: string) => createRePd({ pdId, content: pd }),
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

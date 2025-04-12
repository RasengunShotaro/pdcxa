"use client";

import { createPd } from "@/feature/pd/api/create-pd";
import { fetchPds } from "@/feature/pd/api/fetch-pds";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const usePd = (pdIds?: string[]) => {
  const queryClient = useQueryClient();
  const { user } = useUser();

  const { data: pds = [], error } = useQuery({
    queryKey: ["PD詳細", pdIds],
    queryFn: async () => fetchPds(pdIds),
  });

  const { mutate: createNewPd } = useMutation({
    mutationFn: (pd: string) => createPd(pd, user?.id ?? ""),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["PD詳細"] });
    },
  });

  return {
    pds,
    error,
    createPd: createNewPd,
  };
};

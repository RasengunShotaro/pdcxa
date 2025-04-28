"use client";

import { createPd } from "@/feature/pd/api/pd/create-pd";
import { fetchPds } from "@/feature/pd/api/pd/fetch-pds";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const usePd = (pdId?: string) => {
  const queryClient = useQueryClient();
  const { user } = useUser();

  const {
    data: pds = [],
    isPending,
    error,
  } = useQuery({
    queryKey: ["PD詳細", pdId],
    queryFn: async () => fetchPds(pdId),
  });

  const { mutate: createNewPd } = useMutation({
    mutationFn: (content: string) => createPd(content, user?.id ?? ""),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["PD詳細"] });
    },
  });

  return {
    pds,
    isPending,
    error,
    createPd: createNewPd,
  };
};

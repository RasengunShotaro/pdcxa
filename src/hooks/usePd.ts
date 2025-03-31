"use client";

import { pdApi } from "@/feature/pd/api/pd";
import type { Pd } from "@/types/pd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const PD_QUERY_KEY = ["pds"] as const;

export const usePd = () => {
  const queryClient = useQueryClient();

  const { data: pds = [], error } = useQuery({
    queryKey: PD_QUERY_KEY,
    queryFn: pdApi.getPds,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const { mutate: createPd } = useMutation({
    mutationFn: pdApi.createPd,
    onSuccess: (newPd) => {
      queryClient.setQueryData<Pd[]>(PD_QUERY_KEY, (old = []) => [
        newPd,
        ...old,
      ]);
    },
  });

  return {
    pds,
    error,
    createPd,
  };
};

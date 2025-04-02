"use client";

import {
  PD_QUERY_KEY,
  REPD_QUERY_KEY,
  createRePd,
  getRePds,
  updateRePdCache,
} from "@/feature/pd/api/pd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useRePd = (pdId: string) => {
  const queryClient = useQueryClient();

  const { data: rePds = [], error } = useQuery({
    queryKey: [...PD_QUERY_KEY, pdId],
    queryFn: async () => {
      const pds = await getRePds(pdId);
      return pds;
    },
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const { mutate: createNewRePd } = useMutation({
    mutationFn: (content: string) => createRePd(pdId, content),
    onSuccess: () => {
      updateRePdCache(queryClient, pdId);
      queryClient.invalidateQueries({ queryKey: [...PD_QUERY_KEY, pdId] });
      queryClient.invalidateQueries({ queryKey: REPD_QUERY_KEY });
    },
  });

  return {
    rePds,
    error,
    createRePd: createNewRePd,
  };
};

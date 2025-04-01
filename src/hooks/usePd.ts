"use client";

import { PD_QUERY_KEY, createPd, getPds, updatePdCache } from "@/lib/pdCommon";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const usePd = () => {
  const queryClient = useQueryClient();

  const { data: pds = [], error } = useQuery({
    queryKey: PD_QUERY_KEY,
    queryFn: getPds,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const { mutate: createNewPd } = useMutation({
    mutationFn: createPd,
    onSuccess: (newPd) => {
      updatePdCache(queryClient, newPd);
    },
  });

  return {
    pds,
    error,
    createPd: createNewPd,
  };
};

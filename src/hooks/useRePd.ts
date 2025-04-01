"use client";

import { createRePd, updateRePdCache } from "@/lib/pdCommon";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useRePd = () => {
  const queryClient = useQueryClient();

  const { mutate: replyPd } = useMutation({
    mutationFn: ({ pdId, content }: { pdId: string; content: string }) =>
      createRePd(pdId, content),
    onSuccess: (newRePd) => {
      updateRePdCache(queryClient, newRePd.pdId, newRePd);
    },
  });

  return {
    replyPd,
  };
};

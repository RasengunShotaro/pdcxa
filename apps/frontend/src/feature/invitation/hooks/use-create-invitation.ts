"use client";

import { useMutation } from "@tanstack/react-query";
import { createInvitation } from "@/feature/invitation/create-invitation";

export const useCreateInvitation = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: createInvitation,
  });

  return { createInvitation: mutateAsync, isPending };
};

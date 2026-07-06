"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
  type UpdateProfileHandle,
  useUpdateProfileHandle as useAuthUpdateProfileHandle,
} from "@/lib/auth/use-update-profile";
import { handleDependentQueryKeys } from "./handle-dependent-query-keys";

export const useUpdateProfileHandle = (): UpdateProfileHandle => {
  const { updateProfileHandle } = useAuthUpdateProfileHandle();
  const queryClient = useQueryClient();

  return {
    updateProfileHandle: async (handle) => {
      const result = await updateProfileHandle(handle);
      if (result.ok) {
        await Promise.all(
          handleDependentQueryKeys().map((queryKey) =>
            queryClient.invalidateQueries({ queryKey }),
          ),
        );
      }
      return result;
    },
  };
};

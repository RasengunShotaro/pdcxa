"use client";

import {
  type UpdateProfileHandle,
  useUpdateProfileHandle as useAuthUpdateProfileHandle,
} from "@/lib/auth/use-update-profile";
import { useRefreshUserDisplay } from "./use-refresh-user-display";

export const useUpdateProfileHandle = (): UpdateProfileHandle => {
  const { updateProfileHandle } = useAuthUpdateProfileHandle();
  const refreshUserDisplay = useRefreshUserDisplay();

  return {
    updateProfileHandle: async (handle) => {
      const result = await updateProfileHandle(handle);
      if (result.ok) {
        await refreshUserDisplay();
      }
      return result;
    },
  };
};

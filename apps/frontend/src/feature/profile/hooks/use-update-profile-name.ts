"use client";

import {
  type UpdateProfileName,
  useUpdateProfileName as useAuthUpdateProfileName,
} from "@/lib/auth/use-update-profile";
import { useRefreshUserDisplay } from "./use-refresh-user-display";

export const useUpdateProfileName = (): UpdateProfileName => {
  const { updateProfileName } = useAuthUpdateProfileName();
  const refreshUserDisplay = useRefreshUserDisplay();

  return {
    updateProfileName: async (input) => {
      await updateProfileName(input);
      await refreshUserDisplay();
    },
  };
};

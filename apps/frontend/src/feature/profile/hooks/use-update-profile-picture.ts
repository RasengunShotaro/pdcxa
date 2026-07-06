"use client";

import {
  type UpdateProfilePicture,
  useUpdateProfilePicture as useAuthUpdateProfilePicture,
} from "@/lib/auth/use-update-profile";
import { useRefreshUserDisplay } from "./use-refresh-user-display";

export const useUpdateProfilePicture = (): UpdateProfilePicture => {
  const { updateProfilePicture } = useAuthUpdateProfilePicture();
  const refreshUserDisplay = useRefreshUserDisplay();

  return {
    updateProfilePicture: async (file) => {
      await updateProfilePicture(file);
      await refreshUserDisplay();
    },
  };
};

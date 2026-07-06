"use client";

import { useQueryClient } from "@tanstack/react-query";
import { userDisplayQueryKeys } from "./user-display-query-keys";

export const useRefreshUserDisplay = (): (() => Promise<void>) => {
  const queryClient = useQueryClient();

  return async () => {
    await Promise.all(
      userDisplayQueryKeys().map((queryKey) =>
        queryClient.invalidateQueries({ queryKey }),
      ),
    );
  };
};

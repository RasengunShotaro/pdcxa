"use client";

import { useFetchNotificationUnreadCount } from "@/schema/api";

export const useUnreadCount = (): number => {
  const { data } = useFetchNotificationUnreadCount({
    query: {
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      staleTime: 0,
    },
  });

  return data?.data.count ?? 0;
};

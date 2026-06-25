"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchUnreadCount } from "../api/fetch-unread-count";

export const UNREAD_COUNT_QUERY_KEY = ["通知", "未読件数"] as const;

export const useUnreadCount = (): number => {
  const { data } = useQuery({
    queryKey: UNREAD_COUNT_QUERY_KEY,
    queryFn: fetchUnreadCount,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  return data?.count ?? 0;
};

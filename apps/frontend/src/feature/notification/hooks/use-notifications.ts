"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { legacyDelay } from "@/utils/legacy-delay";
import { fetchNotifications } from "../api/fetch-notifications";
import { markNotificationsSeen } from "../api/mark-notifications-seen";
import type { NotificationItem } from "../types";
import { UNREAD_COUNT_QUERY_KEY } from "./use-unread-count";

export const useNotifications = () => {
  const queryClient = useQueryClient();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isPending,
    isFetchingNextPage,
    isError,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["通知一覧"],
    queryFn: async ({ pageParam: cursor }) => {
      await legacyDelay();
      return await fetchNotifications({ cursor });
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    refetchOnMount: true,
  });

  const { mutate: markSeen } = useMutation({
    mutationFn: markNotificationsSeen,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: UNREAD_COUNT_QUERY_KEY });
    },
  });

  const notifications: NotificationItem[] =
    data?.pages.flatMap((page) => page.items) ?? [];

  return {
    notifications,
    isPending,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
    markSeen,
  };
};

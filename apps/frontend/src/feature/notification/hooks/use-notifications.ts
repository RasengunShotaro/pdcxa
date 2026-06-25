"use client";

import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchNotifications,
  getFetchNotificationsQueryKey,
  getFetchNotificationUnreadCountQueryKey,
  useMarkNotificationsSeen,
} from "@/schema/api";
import type { NotificationItem } from "../types";

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
    queryKey: [...getFetchNotificationsQueryKey(), "infinite"],
    queryFn: ({ pageParam, signal }) =>
      fetchNotifications(pageParam ? { cursor: pageParam } : undefined, {
        signal,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.data.nextCursor,
    refetchOnMount: true,
  });

  const { mutate: markSeen } = useMarkNotificationsSeen({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getFetchNotificationUnreadCountQueryKey(),
        });
      },
    },
  });

  const notifications: NotificationItem[] =
    data?.pages.flatMap((page) => page.data.items) ?? [];

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

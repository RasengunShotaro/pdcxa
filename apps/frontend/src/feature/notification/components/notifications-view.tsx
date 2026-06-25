"use client";

import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useInfiniteScroll } from "@/feature/pd/components/timeline/use-infinite-scroll";
import { useNotifications } from "../hooks/use-notifications";
import { NotificationListBody } from "./notification-list-body";

export function NotificationsView() {
  const {
    notifications,
    isPending,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
    markSeen,
  } = useNotifications();

  useEffect(() => {
    markSeen();
  }, [markSeen]);

  const sentinelRef = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    onLoadMore: fetchNextPage,
  });

  return (
    <div className="space-y-4">
      <NotificationListBody
        error={error}
        isError={isError}
        isPending={isPending}
        notifications={notifications}
        onRetry={() => refetch()}
      />

      {notifications.length > 0 ? (
        <>
          <div aria-hidden="true" ref={sentinelRef} />
          {hasNextPage ? (
            <div className="flex justify-center pb-4">
              <Button
                disabled={isFetchingNextPage}
                onClick={() => fetchNextPage()}
                type="button"
                variant="outline"
              >
                {isFetchingNextPage ? (
                  <Loader2 aria-hidden="true" className="size-4 animate-spin" />
                ) : null}
                さらに読む
              </Button>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}

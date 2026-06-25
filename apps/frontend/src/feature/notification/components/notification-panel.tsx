"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useNotifications } from "../hooks/use-notifications";
import { NotificationListBody } from "./notification-list-body";

interface NotificationPanelProps {
  onNavigate?: () => void;
}

export function NotificationPanel({ onNavigate }: NotificationPanelProps) {
  const { notifications, isPending, isError, error, refetch, markSeen } =
    useNotifications();

  useEffect(() => {
    markSeen();
  }, [markSeen]);

  return (
    <div className="flex max-h-[26rem] w-96 flex-col gap-3">
      <h2 className="text-base font-semibold text-foreground">通知</h2>

      <div className="flex-1 overflow-y-auto">
        <NotificationListBody
          error={error}
          isError={isError}
          isPending={isPending}
          notifications={notifications}
          onRetry={() => refetch()}
          onSelect={onNavigate}
          skeletonCount={4}
        />
      </div>

      <Link
        className="block border-t pt-3 text-center text-sm font-medium text-primary transition-colors hover:underline"
        href="/notifications"
        onClick={onNavigate}
      >
        すべての通知を見る
      </Link>
    </div>
  );
}

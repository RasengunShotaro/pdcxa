import { Bell } from "lucide-react";
import { EmptyState } from "@/components/elements/empty-state";
import { ListError } from "@/components/elements/list-error";
import { ListSkeleton } from "@/components/elements/list-skeleton";
import type { NotificationItem as NotificationItemType } from "../types";
import { notificationKey } from "../utils/notification-key";
import { NotificationItem } from "./notification-item";

interface NotificationListBodyProps {
  notifications: NotificationItemType[];
  isPending: boolean;
  isError: boolean;
  error: unknown;
  onRetry: () => void;
  onSelect?: () => void;
  skeletonCount?: number;
}

export function NotificationListBody({
  notifications,
  isPending,
  isError,
  error,
  onRetry,
  onSelect,
  skeletonCount = 5,
}: NotificationListBodyProps) {
  if (isPending && notifications.length === 0) {
    return <ListSkeleton count={skeletonCount} />;
  }

  if (isError && notifications.length === 0) {
    return <ListError error={error} onRetry={onRetry} />;
  }

  if (notifications.length === 0) {
    return (
      <EmptyState
        icon={<Bell aria-hidden="true" className="size-8" />}
        message="まだ反応はありません"
      />
    );
  }

  return (
    <ul className="space-y-2">
      {notifications.map((item) => (
        <li key={notificationKey(item)}>
          <NotificationItem item={item} onSelect={onSelect} />
        </li>
      ))}
    </ul>
  );
}

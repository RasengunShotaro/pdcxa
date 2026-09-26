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
  variant?: "cards" | "rows";
}

export function NotificationListBody({
  notifications,
  isPending,
  isError,
  error,
  onRetry,
  onSelect,
  skeletonCount = 5,
  variant = "cards",
}: NotificationListBodyProps) {
  if (isPending && notifications.length === 0) {
    return <ListSkeleton count={skeletonCount} variant={variant} />;
  }

  if (isError && notifications.length === 0) {
    return variant === "rows" ? (
      <div className="p-4">
        <ListError error={error} onRetry={onRetry} />
      </div>
    ) : (
      <ListError error={error} onRetry={onRetry} />
    );
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
    <ul
      className={
        variant === "rows"
          ? "divide-y divide-border border-b border-border"
          : "space-y-2"
      }
    >
      {notifications.map((item) => (
        <li key={notificationKey(item)}>
          <NotificationItem item={item} onSelect={onSelect} variant={variant} />
        </li>
      ))}
    </ul>
  );
}

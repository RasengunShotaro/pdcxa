"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { ListError } from "@/components/elements/list-error";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { avatarInitials } from "@/feature/pd/components/timeline/avatar-initials";
import {
  formatAbsoluteDateTime,
  formatDateTime,
} from "@/feature/pd/utils/format-datetime";
import { useNotifications } from "../hooks/use-notifications";
import {
  最近の通知を選ぶ,
  行為者の表示名,
  通知のリンク先,
  通知の行為文言,
} from "../utils/notification-display";
import { notificationKey } from "../utils/notification-key";

const RECENT_LIMIT = 5;

export function RecentNotificationsCard() {
  const { notifications, isPending, isError, error, refetch } =
    useNotifications();
  const recent = 最近の通知を選ぶ({ notifications, limit: RECENT_LIMIT });

  return (
    <section
      aria-labelledby="recent-notifications-heading"
      className="rounded-xl border border-border bg-card p-4 shadow-sm"
    >
      <h2
        className="px-2 pb-2 text-sm font-bold text-foreground"
        id="recent-notifications-heading"
      >
        最近の通知
      </h2>

      {isPending && recent.length === 0 ? (
        <output aria-label="読み込み中" className="block space-y-3 px-2 py-1">
          {["a", "b", "c"].map((id) => (
            <div className="flex items-center gap-3" key={id}>
              <Skeleton className="size-8 rounded-full" />
              <Skeleton className="h-4 flex-1" />
            </div>
          ))}
        </output>
      ) : null}

      {isError && recent.length === 0 ? (
        <ListError error={error} onRetry={() => refetch()} />
      ) : null}

      {!isPending && !isError && recent.length === 0 ? (
        <p className="px-2 py-4 text-sm text-muted-foreground">
          まだ反応はありません
        </p>
      ) : null}

      {recent.length > 0 ? (
        <ul className="space-y-1">
          {recent.map((item) => {
            const displayName = 行為者の表示名(item.actor);
            return (
              <li key={notificationKey(item)}>
                <Link
                  className="flex items-start gap-3 rounded-lg px-2 py-2 transition-[background-color,translate] hover:-translate-y-px hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                  href={通知のリンク先(item)}
                >
                  <Avatar className="size-8 shrink-0">
                    <AvatarImage alt="" src={item.actor.imageUrl} />
                    <AvatarFallback className="bg-primary-50 text-xs font-medium text-primary-600 dark:bg-primary/15 dark:text-primary-300">
                      {avatarInitials(displayName)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="min-w-0 flex-1">
                    <span className="line-clamp-2 text-sm text-body">
                      <span className="font-bold text-foreground">
                        {displayName}
                      </span>
                      さんが{通知の行為文言(item.kind)}
                    </span>
                    <time
                      className="block text-xs text-muted-foreground"
                      dateTime={item.createdAt}
                      suppressHydrationWarning
                      title={formatAbsoluteDateTime(item.createdAt)}
                    >
                      {formatDateTime(item.createdAt)}
                    </time>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : null}

      <Link
        className="mt-2 flex items-center justify-between rounded-lg px-2 py-2 text-sm font-medium text-primary-600 transition-colors hover:bg-accent dark:text-primary-300"
        href="/notifications"
      >
        すべての通知を見る
        <ChevronRight aria-hidden="true" className="size-4" />
      </Link>
    </section>
  );
}

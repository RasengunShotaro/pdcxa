"use client";

import { useQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { ListError } from "@/components/elements/list-error";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchDetailedPdWeeklyStats } from "@/feature/pd/api/pd/fetch-detailed-weekly-stats";
import { weeklyStatsQueryKey } from "@/feature/pd/api/query-keys";
import { avatarInitials } from "@/feature/pd/components/timeline/avatar-initials";
import {
  formatRangeLabel,
  hasNoActivity,
  上位の投稿者を選ぶ,
  投稿者の表示名,
} from "@/feature/pd/utils/stats-derive";

const TOP_AUTHOR_LIMIT = 3;

export function WeeklyActivityCard() {
  const {
    data: stats,
    isPending,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: weeklyStatsQueryKey(),
    queryFn: fetchDetailedPdWeeklyStats,
  });

  return (
    <section
      aria-labelledby="weekly-activity-heading"
      className="rounded-xl border border-border bg-card p-6 shadow-sm"
    >
      <div className="flex items-baseline justify-between gap-2 pb-3">
        <h2
          className="text-sm font-bold text-foreground"
          id="weekly-activity-heading"
        >
          今週の活動
        </h2>
        {stats ? (
          <span className="text-xs text-muted-foreground">
            {formatRangeLabel(stats.range)}
          </span>
        ) : null}
      </div>

      {isPending ? (
        <output aria-label="読み込み中" className="block space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-2/3" />
        </output>
      ) : null}

      {isError ? <ListError error={error} onRetry={() => refetch()} /> : null}

      {stats ? (
        <>
          <dl className="grid grid-cols-3 gap-2 text-center">
            {[
              { label: "PD", value: stats.totals.pdCount },
              { label: "RePD", value: stats.totals.rePdCount },
              { label: "いいね", value: stats.totals.likeCount },
            ].map((item) => (
              <div
                className="rounded-lg bg-muted/60 px-1 py-2"
                key={item.label}
              >
                <dt className="text-xs text-muted-foreground">{item.label}</dt>
                <dd className="text-lg font-bold text-foreground tabular-nums">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>

          {hasNoActivity(stats.totals) ? (
            <p className="pt-4 text-xs text-muted-foreground">
              今週はまだ投稿がありません
            </p>
          ) : (
            <ol className="-mx-2 space-y-0.5 pt-4">
              {上位の投稿者を選ぶ({
                rankings: stats.rankings,
                limit: TOP_AUTHOR_LIMIT,
              }).map((row, index) => {
                const name = 投稿者の表示名(row);
                const content = (
                  <>
                    <span
                      aria-hidden="true"
                      className="w-4 shrink-0 text-center text-xs font-bold text-muted-foreground tabular-nums"
                    >
                      {index + 1}
                    </span>
                    <Avatar className="size-7 shrink-0">
                      <AvatarImage alt="" src={row.imageUrl} />
                      <AvatarFallback className="bg-primary-50 text-xs font-medium text-primary-600 dark:bg-primary/15 dark:text-primary-300">
                        {avatarInitials(name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="min-w-0 flex-1 truncate text-sm text-foreground">
                      {name}
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                      {row.pdCount} PD
                    </span>
                  </>
                );
                return (
                  <li key={row.userId}>
                    {row.userName ? (
                      <Link
                        className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-[background-color,translate] hover:-translate-y-px hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                        href={`/user/${row.userName}`}
                      >
                        {content}
                      </Link>
                    ) : (
                      <div className="flex items-center gap-2 px-2 py-1.5">
                        {content}
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>
          )}
        </>
      ) : null}

      <Link
        className="-mx-2 mt-2 flex items-center justify-between rounded-lg px-2 py-2 text-sm font-medium text-primary-600 transition-colors hover:bg-accent dark:text-primary-300"
        href="/stats"
      >
        統計を見る
        <ChevronRight aria-hidden="true" className="size-4" />
      </Link>
    </section>
  );
}

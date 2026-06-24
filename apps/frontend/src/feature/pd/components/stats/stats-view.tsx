"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchDetailedPdWeeklyStats } from "@/feature/pd/api/pd/fetch-detailed-weekly-stats";
import { PDCXAInsight } from "./pdcxa-insight";

const dateFormatter = new Intl.DateTimeFormat("ja-JP", {
  month: "long",
  day: "numeric",
});

export const StatsView = () => {
  const {
    data: stats,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["週次統計"],
    queryFn: fetchDetailedPdWeeklyStats,
  });

  if (isPending) {
    return (
      <div className="space-y-6 pb-4 max-w-7xl w-full">
        <div className="space-y-2">
          <div className="h-8 w-48 animate-pulse rounded bg-muted" />
          <div className="h-4 w-64 animate-pulse rounded bg-muted" />
        </div>
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          {[0, 1, 2, 3].map((index) => (
            <div
              className="h-28 animate-pulse rounded-xl bg-muted"
              key={index}
            />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <div className="max-w-7xl w-full text-muted-foreground">
        統計の取得に失敗しました。
      </div>
    );
  }

  const rangeLabel = `${dateFormatter.format(new Date(stats.range.start))} 〜 ${dateFormatter.format(new Date(stats.range.end))}`;

  return (
    <div className="space-y-6 pb-4 max-w-7xl w-full">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">PDCXA insight</h1>
        <p className="text-muted-foreground text-sm">
          {rangeLabel} のアクティビティ
        </p>
      </div>
      <PDCXAInsight stats={stats} />
    </div>
  );
};

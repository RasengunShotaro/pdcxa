"use client";

import { useQuery } from "@tanstack/react-query";
import { ListError } from "@/components/elements/list-error";
import { fetchDetailedPdWeeklyStats } from "@/feature/pd/api/pd/fetch-detailed-weekly-stats";
import {
  formatRangeLabel,
  summarizeStats,
  toActivityChartData,
} from "@/feature/pd/utils/stats-derive";
import { ActivityTrend } from "./activity-trend";
import { ContributorRanking } from "./contributor-ranking";
import { StatCard } from "./stat-card";
import { StatsSkeleton } from "./stats-skeleton";

export const StatsView = () => {
  const {
    data: stats,
    isPending,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["週次統計"],
    queryFn: fetchDetailedPdWeeklyStats,
  });

  if (isPending) {
    return <StatsSkeleton />;
  }

  if (isError) {
    return <ListError error={error} onRetry={() => refetch()} />;
  }

  const summary = summarizeStats(stats);
  const chartData = toActivityChartData(stats.daily);

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-xl font-bold text-foreground">週次統計</h1>
        <p className="text-sm text-muted-foreground">
          直近7日間 · {formatRangeLabel(stats.range)}
        </p>
      </header>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {summary.map((item) => (
          <StatCard item={item} key={item.key} />
        ))}
      </div>

      <ActivityTrend data={chartData} />

      <ContributorRanking rankings={stats.rankings} />
    </div>
  );
};

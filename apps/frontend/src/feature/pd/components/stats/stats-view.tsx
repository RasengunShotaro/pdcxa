"use client";

import { useQuery } from "@tanstack/react-query";
import { ListError } from "@/components/elements/list-error";
import { fetchDetailedPdWeeklyStats } from "@/feature/pd/api/pd/fetch-detailed-weekly-stats";
import { weeklyStatsQueryKey } from "@/feature/pd/api/query-keys";
import {
  formatRangeLabel,
  summarizeStats,
  toActivityChartData,
} from "@/feature/pd/utils/stats-derive";
import { ActivityTrend } from "./activity-trend";
import { ContributorRanking } from "./contributor-ranking";
import { FootprintHeatmap } from "./footprint-heatmap";
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
    queryKey: weeklyStatsQueryKey(),
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
    <div className="@container flex flex-col gap-6">
      <header className="flex items-baseline gap-3">
        <h2 className="text-[1rem] leading-normal font-bold text-ink">
          直近7日間
        </h2>
        <p className="text-[0.8125rem] text-ink-3">
          {formatRangeLabel(stats.range)}
        </p>
      </header>

      <div className="grid grid-cols-2 gap-y-[22px] @[620px]:grid-cols-4">
        {summary.map((item) => (
          <StatCard item={item} key={item.key} />
        ))}
      </div>

      <div className="grid gap-7 @[760px]:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] @[760px]:gap-10">
        <ActivityTrend data={chartData} />
        <ContributorRanking rankings={stats.rankings} />
      </div>

      <FootprintHeatmap />
    </div>
  );
};

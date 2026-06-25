"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import type { ActivityBarChartProps } from "./activity-bar-chart-inner";

export type { BarSeries } from "./activity-bar-chart-inner";

const ActivityBarChartInner = dynamic(
  () => import("./activity-bar-chart-inner"),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[280px] w-full" />,
  },
);

export function ActivityBarChart(props: ActivityBarChartProps) {
  return <ActivityBarChartInner {...props} />;
}

import {
  ActivityBarChart,
  type BarSeries,
} from "@/components/elements/activity-bar-chart";
import type { ActivityChartDatum } from "@/feature/pd/utils/stats-derive";
import { DailyBreakdown } from "./daily-breakdown";
import { StatsBlock } from "./stats-block";

const SERIES: BarSeries[] = [
  { key: "pdCount", label: "PD", color: "var(--brand)" },
  {
    key: "rePdCount",
    label: "RePD",
    color: "color-mix(in srgb, var(--brand-ink) 45%, transparent)",
  },
  { key: "likeCount", label: "いいね", color: "var(--chart-8)" },
];

interface ActivityTrendProps {
  data: ActivityChartDatum[];
}

export function ActivityTrend({ data }: ActivityTrendProps) {
  return (
    <StatsBlock
      description="日別のPD・RePD・いいねの推移"
      title="投稿アクティビティ"
    >
      <ActivityBarChart
        ariaLabel="日別のPD・RePD・いいねの件数を並べた棒グラフ"
        data={data}
        height={224}
        series={SERIES}
        xKey="shortDate"
      />
      <DailyBreakdown data={data} />
    </StatsBlock>
  );
}

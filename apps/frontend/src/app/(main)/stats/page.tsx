import { fetchDetailedPdWeeklyStats } from "@/feature/pd/api/pd/fetch-detailed-weekly-stats";
import { PDCXAInsight } from "@/feature/pd/components/stats/pdcxa-insight";

const dateFormatter = new Intl.DateTimeFormat("ja-JP", {
  month: "long",
  day: "numeric",
});

export default async function PdStatsPage() {
  const stats = await fetchDetailedPdWeeklyStats();
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
}

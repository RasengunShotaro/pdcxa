import {
  ActivityBarChart,
  type BarSeries,
} from "@/components/elements/activity-bar-chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ActivityChartDatum } from "@/feature/pd/utils/stats-derive";

const SERIES: BarSeries[] = [
  { key: "pdCount", label: "PD", color: "var(--chart-7)" },
  { key: "rePdCount", label: "RePD", color: "var(--chart-6)" },
  { key: "likeCount", label: "いいね", color: "var(--chart-8)" },
];

interface ActivityTrendProps {
  data: ActivityChartDatum[];
}

export function ActivityTrend({ data }: ActivityTrendProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">投稿アクティビティ</CardTitle>
        <CardDescription>日別の PD・RePD・いいねの推移</CardDescription>
      </CardHeader>
      <CardContent>
        <ActivityBarChart
          ariaLabel="日別の PD・RePD・いいねの積み上げ棒グラフ"
          data={data}
          series={SERIES}
          xKey="shortDate"
        />

        <table className="sr-only">
          <caption>日別アクティビティ（PD・RePD・いいね）</caption>
          <thead>
            <tr>
              <th scope="col">日付</th>
              <th scope="col">PD</th>
              <th scope="col">RePD</th>
              <th scope="col">いいね</th>
            </tr>
          </thead>
          <tbody>
            {data.map((day) => (
              <tr key={day.date}>
                <th scope="row">{day.fullLabel}</th>
                <td>{day.pdCount}</td>
                <td>{day.rePdCount}</td>
                <td>{day.likeCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

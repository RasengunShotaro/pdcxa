import type { ActivityChartDatum } from "@/feature/pd/utils/stats-derive";

interface DailyBreakdownProps {
  data: ActivityChartDatum[];
}

export function DailyBreakdown({ data }: DailyBreakdownProps) {
  return (
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
  );
}

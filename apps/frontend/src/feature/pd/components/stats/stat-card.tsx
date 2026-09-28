import { CountUpNumber } from "@/components/elements/count-up-number";
import { Card, CardContent } from "@/components/ui/card";
import type { StatSummaryItem } from "@/feature/pd/utils/stats-derive";

interface StatCardProps {
  item: StatSummaryItem;
}

const toJapaneseNumber = (value: number): string =>
  value.toLocaleString("ja-JP");

export function StatCard({ item }: StatCardProps) {
  return (
    <Card>
      <CardContent className="space-y-1 p-4 sm:p-5">
        <p className="text-sm text-muted-foreground">{item.label}</p>
        <p className="text-3xl font-bold tabular-nums text-foreground">
          <CountUpNumber format={toJapaneseNumber} value={item.value} />
        </p>
        <p className="text-sm text-muted-foreground">{item.supporting}</p>
      </CardContent>
    </Card>
  );
}

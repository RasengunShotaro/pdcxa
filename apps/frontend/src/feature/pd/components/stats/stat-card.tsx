import { CountUpNumber } from "@/components/elements/count-up-number";
import type { StatSummaryItem } from "@/feature/pd/utils/stats-derive";

interface StatCardProps {
  item: StatSummaryItem;
}

const toJapaneseNumber = (value: number): string =>
  value.toLocaleString("ja-JP");

export function StatCard({ item }: StatCardProps) {
  return (
    <div className="flex flex-col gap-0.5 border-l border-line px-5 odd:border-l-0 odd:pl-0 @[620px]:odd:border-l @[620px]:odd:pl-5 @[620px]:first:border-l-0 @[620px]:first:pl-0">
      <p className="text-[0.8125rem] leading-[1.4] text-ink-3">{item.label}</p>
      <p className="text-[2.5rem] leading-[1.15] font-semibold text-ink tabular-nums">
        <CountUpNumber format={toJapaneseNumber} value={item.value} />
      </p>
      <p className="text-[0.8125rem] leading-[1.4] text-ink-3">
        {item.supporting}
      </p>
    </div>
  );
}

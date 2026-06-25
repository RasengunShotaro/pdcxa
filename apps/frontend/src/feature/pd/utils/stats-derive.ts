import type { PdWeeklyStats } from "../types/stats";

export interface StatSummaryItem {
  key: "pd" | "repd" | "like" | "author";
  label: string;
  value: number;
  supporting: string;
}

export interface ActivityChartDatum {
  date: string;
  shortDate: string;
  fullLabel: string;
  pdCount: number;
  rePdCount: number;
  likeCount: number;
  [key: string]: string | number;
}

const toShortDate = (dateStr: string): string => {
  const [, month, day] = dateStr.split("-");
  return `${Number(month)}/${Number(day)}`;
};

const fullDateFormatter = new Intl.DateTimeFormat("ja-JP", {
  month: "long",
  day: "numeric",
  weekday: "short",
  timeZone: "UTC",
});

const rangeDateFormatter = new Intl.DateTimeFormat("ja-JP", {
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

const toUtcDate = (dateStr: string): Date => new Date(`${dateStr}T00:00:00Z`);

const roundToTenth = (value: number): number => Number(value.toFixed(1));

const perPdSupporting = (count: number, pdCount: number): string =>
  pdCount === 0
    ? "PD投稿がまだありません"
    : `1PDあたり ${roundToTenth(count / pdCount)}件`;

export const summarizeStats = (
  stats: Pick<PdWeeklyStats, "totals" | "daily">,
): StatSummaryItem[] => {
  const { totals, daily } = stats;
  const dayCount = daily.length === 0 ? 1 : daily.length;
  const perDay = roundToTenth(totals.pdCount / dayCount);

  return [
    {
      key: "pd",
      label: "PD投稿数",
      value: totals.pdCount,
      supporting: `1日平均 ${perDay}件`,
    },
    {
      key: "repd",
      label: "RePD数",
      value: totals.rePdCount,
      supporting: perPdSupporting(totals.rePdCount, totals.pdCount),
    },
    {
      key: "like",
      label: "いいね",
      value: totals.likeCount,
      supporting: perPdSupporting(totals.likeCount, totals.pdCount),
    },
    {
      key: "author",
      label: "アクティブ投稿者",
      value: totals.activeAuthorCount,
      supporting:
        totals.activeAuthorCount === 0
          ? "まだ投稿者がいません"
          : `平均 ${totals.averagePdPerAuthor}件/人`,
    },
  ];
};

export const toActivityChartData = (
  daily: PdWeeklyStats["daily"],
): ActivityChartDatum[] =>
  daily.map((entry) => {
    const date = toUtcDate(entry.date);
    return {
      date: entry.date,
      shortDate: toShortDate(entry.date),
      fullLabel: fullDateFormatter.format(date),
      pdCount: entry.pdCount,
      rePdCount: entry.rePdCount,
      likeCount: entry.likeCount,
    };
  });

export const hasNoActivity = (totals: PdWeeklyStats["totals"]): boolean =>
  totals.pdCount === 0 && totals.rePdCount === 0 && totals.likeCount === 0;

export const formatRangeLabel = (range: {
  start: string;
  end: string;
}): string =>
  `${rangeDateFormatter.format(toUtcDate(range.start))} 〜 ${rangeDateFormatter.format(toUtcDate(range.end))}`;

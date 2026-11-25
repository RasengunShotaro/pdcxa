export type FootprintLevel = 0 | 1 | 2 | 3 | 4;

export interface FootprintDay {
  readonly date: string;
  readonly pdCount: number;
  readonly rePdCount: number;
  readonly likeCount: number;
}

export interface FootprintCell extends FootprintDay {
  readonly level: FootprintLevel;
}

export interface PlacedFootprintCell extends FootprintCell {
  readonly column: number;
  readonly row: number;
}

export interface FootprintMonth {
  readonly column: number;
  readonly label: string;
}

export interface FootprintCalendar {
  readonly columnCount: number;
  readonly cells: readonly PlacedFootprintCell[];
  readonly months: readonly FootprintMonth[];
}

const 濃さの段階: readonly FootprintLevel[] = [1, 2, 3, 4];
const 曜日の名前 = ["日", "月", "火", "水", "木", "金", "土"] as const;
const 一週間 = 7;
const 月の目盛りどうしの最小の間隔 = 3;

export const 目盛りに出す曜日: readonly { row: number; label: string }[] = [
  { row: 1, label: "月" },
  { row: 3, label: "水" },
  { row: 5, label: "金" },
];

const 日付を読む = (date: string): Date => new Date(`${date}T00:00:00Z`);

export const 活動の濃さを決める = ({
  count,
  max,
}: {
  count: number;
  max: number;
}): FootprintLevel => {
  if (count <= 0 || max <= 0) return 0;
  const index = Math.min(
    濃さの段階.length - 1,
    Math.ceil((count / max) * 濃さの段階.length) - 1,
  );
  return 濃さの段階[index] ?? 0;
};

export const あしあとのマスを作る = (
  days: readonly FootprintDay[],
): FootprintCell[] => {
  const counts = days.map((day) => day.pdCount + day.rePdCount);
  const max = Math.max(0, ...counts);
  return days.map((day, index) => ({
    ...day,
    level: 活動の濃さを決める({ count: counts[index] ?? 0, max }),
  }));
};

const 月の目盛りを作る = (
  cells: readonly PlacedFootprintCell[],
): FootprintMonth[] => {
  const 月初め = cells
    .filter((cell) => 日付を読む(cell.date).getUTCDate() === 1)
    .map((cell) => ({
      column: cell.column,
      label: `${日付を読む(cell.date).getUTCMonth() + 1}月`,
    }));
  const first = cells[0];
  if (!first) return 月初め;
  const 最初の月初めの列 = 月初め[0]?.column ?? Number.POSITIVE_INFINITY;
  if (最初の月初めの列 < 月の目盛りどうしの最小の間隔) return 月初め;
  return [
    { column: 0, label: `${日付を読む(first.date).getUTCMonth() + 1}月` },
    ...月初め,
  ];
};

export const あしあとを週ごとに並べる = (
  cells: readonly FootprintCell[],
): FootprintCalendar => {
  const first = cells[0];
  if (!first) return { columnCount: 0, cells: [], months: [] };
  const offset = 日付を読む(first.date).getUTCDay();
  const placed = cells.map((cell, index) => ({
    ...cell,
    column: Math.floor((offset + index) / 一週間),
    row: (offset + index) % 一週間,
  }));

  return {
    columnCount: (placed.at(-1)?.column ?? 0) + 1,
    cells: placed,
    months: 月の目盛りを作る(placed),
  };
};

export const あしあとの日付を表す = (date: string): string => {
  const parsed = 日付を読む(date);
  return `${parsed.getUTCMonth() + 1}月${parsed.getUTCDate()}日(${曜日の名前[parsed.getUTCDay()]})`;
};

export const あしあとの件数を表す = (day: FootprintDay): string =>
  day.pdCount + day.rePdCount + day.likeCount === 0
    ? "活動なし"
    : `PD ${day.pdCount}件・RePD ${day.rePdCount}件・いいね ${day.likeCount}件`;

type ArrowKey = "ArrowLeft" | "ArrowRight" | "ArrowUp" | "ArrowDown";

const 矢印キーで進む日数: Readonly<Record<ArrowKey, number>> = {
  ArrowLeft: -一週間,
  ArrowRight: 一週間,
  ArrowUp: -1,
  ArrowDown: 1,
};

const 矢印キーか = (key: string): key is ArrowKey => key in 矢印キーで進む日数;

export const 矢印キーで移る日を決める = ({
  index,
  key,
  count,
}: {
  index: number;
  key: string;
  count: number;
}): number => {
  if (!矢印キーか(key)) return index;
  const next = index + 矢印キーで進む日数[key];
  return next < 0 || next >= count ? index : next;
};

import type { FetchFootprint200 } from "@/schema/models/fetchFootprint200";

const 一日 = 24 * 60 * 60 * 1000;
const 日数 = 52 * 7;
const 直近の連続日数 = 5;

const 日付にする = (time: number): string =>
  new Date(time).toISOString().slice(0, 10);

const 活動の件数を作る = (index: number): number => {
  const wave = Math.sin((index + 1) * 12.9898 + 7) * 43758.5453;
  const noise = wave - Math.floor(wave);
  const weekend = index % 7 >= 5 ? 0.45 : 1;
  const growth = 0.55 + (0.45 * (index + 1)) / 日数;
  return Math.floor(noise * weekend * growth * 6);
};

export const 開発用のあしあとを作る = (today: string): FetchFootprint200 => {
  const end = Date.parse(`${today}T00:00:00Z`);
  const days = Array.from({ length: 日数 }, (_, index) => {
    const count = index >= 日数 - 直近の連続日数 ? 2 : 活動の件数を作る(index);
    return {
      date: 日付にする(end - (日数 - 1 - index) * 一日),
      pdCount: Math.ceil(count / 2),
      rePdCount: Math.floor(count / 2),
      likeCount: count * 2,
    };
  });
  const 途切れた位置 = [...days]
    .reverse()
    .findIndex((day) => day.pdCount + day.rePdCount === 0);

  return {
    range: { start: days[0]?.date ?? today, end: today },
    days,
    currentStreak: 途切れた位置 === -1 ? 日数 : 途切れた位置,
  };
};

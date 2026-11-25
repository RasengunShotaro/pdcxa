const 日本時間のずれ = 9 * 60 * 60 * 1000;
const 曜日の名前 = ["日", "月", "火", "水", "木", "金", "土"] as const;

export const 今日の日付を見出しにする = (now: Date): string => {
  const date = new Date(now.getTime() + 日本時間のずれ);
  return `${date.getUTCMonth() + 1}月${date.getUTCDate()}日 ${曜日の名前[date.getUTCDay()]}曜日`;
};

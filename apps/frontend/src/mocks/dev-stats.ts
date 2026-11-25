import type { FetchWeeklyStats200 } from "@/schema/models/fetchWeeklyStats200";

export const 開発用の週間統計: FetchWeeklyStats200 = {
  range: { start: "2026-11-19", end: "2026-11-25" },
  totals: {
    pdCount: 32,
    rePdCount: 48,
    likeCount: 94,
    activeAuthorCount: 4,
    averagePdPerAuthor: 8,
  },
  daily: [
    { date: "2026-11-19", pdCount: 3, rePdCount: 4, likeCount: 9 },
    { date: "2026-11-20", pdCount: 5, rePdCount: 8, likeCount: 14 },
    { date: "2026-11-21", pdCount: 2, rePdCount: 3, likeCount: 6 },
    { date: "2026-11-22", pdCount: 6, rePdCount: 9, likeCount: 17 },
    { date: "2026-11-23", pdCount: 4, rePdCount: 6, likeCount: 12 },
    { date: "2026-11-24", pdCount: 7, rePdCount: 11, likeCount: 21 },
    { date: "2026-11-25", pdCount: 5, rePdCount: 7, likeCount: 15 },
  ],
  rankings: [
    { userId: "user_dev_haruka", pdCount: 11, rePdCount: 15, likeCount: 30 },
    { userId: "user_2abc", pdCount: 9, rePdCount: 13, likeCount: 26 },
    { userId: "user_dev_ren", pdCount: 7, rePdCount: 11, likeCount: 21 },
    { userId: "user_dev_misaki", pdCount: 5, rePdCount: 9, likeCount: 17 },
  ],
};

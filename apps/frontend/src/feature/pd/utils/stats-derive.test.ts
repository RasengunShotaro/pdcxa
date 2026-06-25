import { describe, expect, it } from "vitest";
import type { PdWeeklyStats } from "../types/stats";
import {
  formatRangeLabel,
  hasNoActivity,
  summarizeStats,
  toActivityChartData,
} from "./stats-derive";

const baseTotals: PdWeeklyStats["totals"] = {
  pdCount: 20,
  rePdCount: 12,
  likeCount: 35,
  activeAuthorCount: 4,
  averagePdPerAuthor: 5,
};

const sevenDays: PdWeeklyStats["daily"] = Array.from({ length: 7 }, (_, i) => ({
  date: `2026-06-${19 + i}`,
  pdCount: 0,
  rePdCount: 0,
  likeCount: 0,
}));

describe("summarizeStats", () => {
  it("活動がある週は補助指標を比率で出す", () => {
    const items = summarizeStats({ totals: baseTotals, daily: sevenDays });

    expect(items.map((i) => i.value)).toEqual([20, 12, 35, 4]);
    expect(items[0].supporting).toBe("1日平均 2.9件");
    expect(items[1].supporting).toBe("1PDあたり 0.6件");
    expect(items[2].supporting).toBe("1PDあたり 1.8件");
    expect(items[3].supporting).toBe("平均 5件/人");
  });

  it("PD投稿0の静かな週でもゼロ除算で NaN/Infinity を出さない", () => {
    const quiet: PdWeeklyStats["totals"] = {
      pdCount: 0,
      rePdCount: 0,
      likeCount: 0,
      activeAuthorCount: 0,
      averagePdPerAuthor: 0,
    };

    const items = summarizeStats({ totals: quiet, daily: sevenDays });

    expect(items[0].supporting).toBe("1日平均 0件");
    expect(items[1].supporting).toBe("PD投稿がまだありません");
    expect(items[2].supporting).toBe("PD投稿がまだありません");
    expect(items[3].supporting).toBe("まだ投稿者がいません");
    for (const item of items) {
      expect(item.supporting).not.toMatch(/NaN|Infinity/);
    }
  });
});

describe("toActivityChartData", () => {
  it("日付文字列をX軸用の短い日付とツールチップ用の完全な日付に変換する", () => {
    const data = toActivityChartData([
      { date: "2026-06-25", pdCount: 3, rePdCount: 1, likeCount: 5 },
    ]);

    expect(data[0].shortDate).toBe("6/25");
    expect(data[0].fullLabel).toBe("6月25日(木)");
    expect(data[0].pdCount).toBe(3);
  });
});

describe("hasNoActivity", () => {
  it("PD/RePD/いいねが全て0なら true", () => {
    expect(
      hasNoActivity({
        pdCount: 0,
        rePdCount: 0,
        likeCount: 0,
        activeAuthorCount: 0,
        averagePdPerAuthor: 0,
      }),
    ).toBe(true);
  });

  it("いずれかに活動があれば false", () => {
    expect(hasNoActivity(baseTotals)).toBe(false);
  });
});

describe("formatRangeLabel", () => {
  it("期間を YYYY-MM-DD から日本語の範囲表記にする", () => {
    expect(formatRangeLabel({ start: "2026-06-19", end: "2026-06-25" })).toBe(
      "6月19日 〜 6月25日",
    );
  });
});

import { describe, expect, it } from "vitest";
import { 開発用のあしあとを作る } from "./dev-footprint";

describe("開発用のあしあとを作る", () => {
  it("今日までの 52 週間ぶんの日を古い順に並べる", () => {
    const footprint = 開発用のあしあとを作る("2026-11-25");

    expect(footprint.days).toHaveLength(364);
    expect(footprint.days.at(-1)?.date).toBe("2026-11-25");
  });

  it("期間の最初の日は今日の 363 日前にする", () => {
    const footprint = 開発用のあしあとを作る("2026-11-25");

    expect(footprint.range).toEqual({ start: "2025-11-27", end: "2026-11-25" });
  });

  it("直近の日は活動があり、連続した日数が 1 日以上になる", () => {
    const footprint = 開発用のあしあとを作る("2026-11-25");

    expect(footprint.currentStreak).toBeGreaterThanOrEqual(5);
  });
});

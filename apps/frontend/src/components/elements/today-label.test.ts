import { describe, expect, it } from "vitest";
import { 今日の日付を見出しにする } from "./today-label";

describe("今日の日付を見出しにする", () => {
  it("月日と曜日を並べて表す", () => {
    const now = new Date("2026-11-25T03:00:00Z");

    const label = 今日の日付を見出しにする(now);

    expect(label).toBe("11月25日 水曜日");
  });

  it("日本時間で日付が変わった後は翌日の日付を表す", () => {
    const now = new Date("2026-11-25T15:30:00Z");

    const label = 今日の日付を見出しにする(now);

    expect(label).toBe("11月26日 木曜日");
  });
});

import { describe, expect, it } from "vitest";
import { 抜粋にする } from "./excerpt";

describe("抜粋にする", () => {
  it("100文字以内ならそのまま返す", () => {
    const content = "あ".repeat(100);

    const result = 抜粋にする(content);

    expect(result).toBe(content);
  });

  it("100文字を超えたら100文字で切り詰めて省略記号を付ける", () => {
    const content = "あ".repeat(150);

    const result = 抜粋にする(content);

    expect(result).toBe(`${"あ".repeat(100)}…`);
  });

  it("サロゲートペアを1文字として数える", () => {
    const content = "👍".repeat(120);

    const result = 抜粋にする(content);

    expect([...result]).toHaveLength(101);
    expect(result.endsWith("…")).toBe(true);
  });
});

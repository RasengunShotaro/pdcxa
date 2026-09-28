import { describe, expect, it } from "vitest";
import { ランキング行の出現を遅らせる秒数を決める } from "./ranking-reveal";

describe("ランキング行の出現を遅らせる秒数を決める", () => {
  it("1位の行は待たずに出す", () => {
    const delay = ランキング行の出現を遅らせる秒数を決める({
      index: 0,
      count: 5,
    });

    expect(delay).toBe(0);
  });

  it("下の順位ほど後から出す", () => {
    const second = ランキング行の出現を遅らせる秒数を決める({
      index: 1,
      count: 5,
    });
    const third = ランキング行の出現を遅らせる秒数を決める({
      index: 2,
      count: 5,
    });

    expect(third).toBeGreaterThan(second);
  });

  it("行が多くても最下位の行は0.3秒以内に出し始める", () => {
    const last = ランキング行の出現を遅らせる秒数を決める({
      index: 49,
      count: 50,
    });

    expect(last).toBeLessThanOrEqual(0.3);
  });
});

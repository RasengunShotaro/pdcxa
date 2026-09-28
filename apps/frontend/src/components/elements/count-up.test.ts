import { describe, expect, it } from "vitest";
import { カウントアップ途中の表示値を決める } from "./count-up";

describe("カウントアップ途中の表示値を決める", () => {
  it("整数の件数へ向かう途中は整数に丸めて見せる", () => {
    const displayed = カウントアップ途中の表示値を決める({
      latest: 12.6,
      target: 20,
    });

    expect(displayed).toBe(13);
  });

  it("小数の目標値へ向かう途中は目標値と同じ桁まで見せる", () => {
    const displayed = カウントアップ途中の表示値を決める({
      latest: Math.PI,
      target: 6.7,
    });

    expect(displayed).toBe(3.1);
  });

  it("目標値を超えて見せない", () => {
    const displayed = カウントアップ途中の表示値を決める({
      latest: 20.4,
      target: 20,
    });

    expect(displayed).toBe(20);
  });

  it("負の途中値は0として見せる", () => {
    const displayed = カウントアップ途中の表示値を決める({
      latest: -0.3,
      target: 5,
    });

    expect(displayed).toBe(0);
  });
});

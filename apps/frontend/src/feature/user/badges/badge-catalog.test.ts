import { describe, expect, it } from "vitest";
import { 表示するバッジに絞る } from "./badge-catalog";

describe("表示するバッジに絞る", () => {
  it("カタログにあるバッジはそのまま残す", () => {
    const result = 表示するバッジに絞る(["originator"]);

    expect(result).toEqual(["originator"]);
  });

  it("カタログに無いバッジ ID は捨てる", () => {
    const result = 表示するバッジに絞る(["unknown", "originator", ""]);

    expect(result).toEqual(["originator"]);
  });

  it("同じバッジが重複していても 1 つにまとめる", () => {
    const result = 表示するバッジに絞る(["originator", "originator"]);

    expect(result).toEqual(["originator"]);
  });

  it("バッジが無ければ空にする", () => {
    const result = 表示するバッジに絞る([]);

    expect(result).toEqual([]);
  });
});

import { describe, expect, it } from "vitest";
import {
  保存一覧の続き位置を作る,
  保存一覧の続き位置を読む,
} from "./bookmark-cursor";

describe("保存一覧の続き位置", () => {
  it("作った続き位置を読むと保存日時と PD を取り出せる", () => {
    const cursor = 保存一覧の続き位置を作る({
      savedAt: "2026-07-01 00:00:00.123456",
      pdId: "0190d2c0-0000-7000-8000-000000000001",
    });

    expect(保存一覧の続き位置を読む(cursor)).toEqual({
      savedAt: "2026-07-01 00:00:00.123456",
      pdId: "0190d2c0-0000-7000-8000-000000000001",
    });
  });

  it("続き位置が無いときは先頭から読む", () => {
    expect(保存一覧の続き位置を読む(undefined)).toBeUndefined();
  });

  it("区切りの無い値は続き位置として扱わない", () => {
    expect(
      保存一覧の続き位置を読む("0190d2c0-0000-7000-8000-000000000001"),
    ).toBeUndefined();
  });
});

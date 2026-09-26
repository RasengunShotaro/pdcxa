import { describe, expect, it } from "vitest";
import { 保存一覧の続き位置を作る } from "#/infrastructure/postgres/bookmark-cursor";
import { fetchBookmarkedPdQuerySchema } from "./schema";

describe("fetchBookmarkedPdQuerySchema", () => {
  it("保存一覧が返した続き位置は、次のページの取得でそのまま受け付ける", () => {
    const cursor = 保存一覧の続き位置を作る({
      savedAt: "2026-07-01 00:00:00.123456",
      pdId: "0190d2c0-0000-7000-8000-000000000002",
    });

    const result = fetchBookmarkedPdQuerySchema.safeParse({ cursor });

    expect(result.success).toBe(true);
  });

  it("秒に端数の無い保存日時の続き位置も受け付ける", () => {
    const cursor = 保存一覧の続き位置を作る({
      savedAt: "2026-07-01 00:00:00",
      pdId: "0190d2c0-0000-7000-8000-000000000002",
    });

    const result = fetchBookmarkedPdQuerySchema.safeParse({ cursor });

    expect(result.success).toBe(true);
  });

  it("形式の違う続き位置は受け付けない", () => {
    const result = fetchBookmarkedPdQuerySchema.safeParse({
      cursor: "0190d2c0-0000-7000-8000-000000000002",
    });

    expect(result.success).toBe(false);
  });
});

import { hashKey } from "@tanstack/react-query";
import { describe, expect, it } from "vitest";
import {
  pdDetailQueryKey,
  rePdDetailQueryKey,
  weeklyStatsQueryKey,
} from "./query-keys";

describe("pdDetailQueryKey", () => {
  it("PD 取得エンドポイントのキーに詳細マーカーを付ける", () => {
    expect(pdDetailQueryKey({ pdId: "p1" })).toEqual([
      "/pd",
      { pdId: "p1" },
      "詳細",
    ]);
  });

  it("引数なしでもホーム用の安定したキーになる", () => {
    expect(pdDetailQueryKey()).toEqual(["/pd", {}, "詳細"]);
  });

  it("ホーム取得側の undefined 揃いの引数と楽観更新側の引数なしが同一キャッシュを指す", () => {
    expect(
      hashKey(pdDetailQueryKey({ pdId: undefined, userName: undefined })),
    ).toBe(hashKey(pdDetailQueryKey()));
  });

  it("PD を絞り込むと別キャッシュになり他の一覧に干渉しない", () => {
    expect(hashKey(pdDetailQueryKey({ pdId: "p1" }))).not.toBe(
      hashKey(pdDetailQueryKey()),
    );
  });
});

describe("rePdDetailQueryKey", () => {
  it("RePD 取得エンドポイントのキーに詳細マーカーを付ける", () => {
    expect(rePdDetailQueryKey("p1")).toEqual(["/repd", { pdId: "p1" }, "詳細"]);
  });
});

describe("weeklyStatsQueryKey", () => {
  it("週次統計エンドポイントのキーを返す", () => {
    expect(weeklyStatsQueryKey()).toEqual(["/pd/stats/weekly"]);
  });
});

import { hashKey } from "@tanstack/react-query";
import { describe, expect, it } from "vitest";
import {
  isPdDetailQueryKey,
  pdDetailQueryKey,
  pdRootQueryKey,
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

describe("isPdDetailQueryKey", () => {
  it("ホーム・プロフィール・詳細の PD 一覧キーはいいね更新の対象になる", () => {
    expect(isPdDetailQueryKey(pdDetailQueryKey())).toBe(true);
    expect(isPdDetailQueryKey(pdDetailQueryKey({ userName: "me" }))).toBe(true);
    expect(isPdDetailQueryKey(pdDetailQueryKey({ pdId: "p1" }))).toBe(true);
  });

  it("RePD 一覧キーは詳細マーカーが同じでもいいね更新の対象にしない", () => {
    expect(isPdDetailQueryKey(rePdDetailQueryKey("p1"))).toBe(false);
  });

  it("詳細マーカーの無い PD ルート・週次統計キーはいいね更新の対象にしない", () => {
    expect(isPdDetailQueryKey(pdRootQueryKey())).toBe(false);
    expect(isPdDetailQueryKey(weeklyStatsQueryKey())).toBe(false);
  });
});

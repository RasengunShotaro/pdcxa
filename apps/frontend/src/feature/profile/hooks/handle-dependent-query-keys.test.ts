import { describe, expect, it } from "vitest";
import { handleDependentQueryKeys } from "./handle-dependent-query-keys";

const prefixes = () =>
  handleDependentQueryKeys().map((queryKey) => queryKey[0]);

describe("ID 変更後に再取得すべきクエリの決定", () => {
  it("PD 一覧・タイムラインの表示を再取得対象に含める", () => {
    expect(prefixes()).toContain("/pd");
  });

  it("RePd といいねの表示を再取得対象に含める", () => {
    expect(prefixes()).toContain("/repd");
  });

  it("週次の貢献統計の表示を再取得対象に含める", () => {
    expect(prefixes()).toContain("/pd/stats/weekly");
  });

  it("通知の投稿者名を再取得対象に含める", () => {
    expect(prefixes()).toContain("/notifications");
  });
});

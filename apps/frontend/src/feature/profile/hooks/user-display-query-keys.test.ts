import { describe, expect, it } from "vitest";
import { userDisplayQueryKeys } from "./user-display-query-keys";

const prefixes = () => userDisplayQueryKeys().map((queryKey) => queryKey[0]);

describe("プロフィール変更後に再取得すべきクエリの決定", () => {
  it("PD 一覧・タイムラインの表示を再取得対象に含める", () => {
    expect(prefixes()).toContain("/pd");
  });

  it("RePd といいねの表示を再取得対象に含める", () => {
    expect(prefixes()).toContain("/repd");
  });

  it("週次の貢献統計の表示を再取得対象に含める", () => {
    expect(prefixes()).toContain("/pd/stats/weekly");
  });

  it("通知の行為者の表示を再取得対象に含める", () => {
    expect(prefixes()).toContain("/notifications");
  });
});

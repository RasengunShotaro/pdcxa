import { describe, expect, it } from "vitest";
import { 画面遷移のリクエストか } from "./page-request";

describe("画面遷移のリクエストかを判定する", () => {
  it("画面の切り替えで取りに行く通知ページは画面遷移として扱う", () => {
    const request = new Request("http://localhost:3000/notifications", {
      headers: { RSC: "1" },
    });

    expect(画面遷移のリクエストか(request)).toBe(true);
  });

  it("通知一覧の取得は画面遷移として扱わない", () => {
    const request = new Request("http://localhost:3000/notifications", {
      headers: { Accept: "application/json" },
    });

    expect(画面遷移のリクエストか(request)).toBe(false);
  });
});

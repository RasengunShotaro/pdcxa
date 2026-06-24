import { HTTPException } from "hono/http-exception";
import { describe, expect, it } from "vitest";
import { 予期しないエラーメッセージ, 境界エラーレスポンス } from "./http-error";

describe("境界エラーレスポンス", () => {
  it("既知の認証エラーはステータスをそのまま返す", () => {
    const result = 境界エラーレスポンス(
      new HTTPException(401, { message: "ログインしていません" }),
    );

    expect(result.status).toBe(401);
  });

  it("想定外のエラーは内部メッセージを伏せて固定文言の500を返す", async () => {
    const result = 境界エラーレスポンス(
      new Error(
        'duplicate key value violates unique constraint "pd_likes_pkey"',
      ),
    );
    const body = await result.text();

    expect(result.status).toBe(500);
    expect(body).toBe(予期しないエラーメッセージ);
    expect(body).not.toContain("pd_likes_pkey");
  });

  it("Error以外の値でも内部情報を漏らさず固定文言の500を返す", async () => {
    const result = 境界エラーレスポンス({ message: "internal-secret-detail" });
    const body = await result.text();

    expect(result.status).toBe(500);
    expect(body).toBe(予期しないエラーメッセージ);
    expect(body).not.toContain("internal-secret-detail");
  });
});

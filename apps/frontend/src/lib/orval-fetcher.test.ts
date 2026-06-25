import { describe, expect, it } from "vitest";
import { handleOrvalResponse } from "./orval-fetcher";

describe("API レスポンスを envelope に変換する", () => {
  it("成功レスポンスの JSON ボディを data に載せて返す", async () => {
    const res = new Response(JSON.stringify({ message: "ok" }), {
      status: 200,
    });

    const result = await handleOrvalResponse<{ data: { message: string } }>(
      res,
    );

    expect(result.data).toEqual({ message: "ok" });
  });

  it("失敗レスポンスでは HTTP ステータス付きの例外を投げる", async () => {
    const res = new Response("internal error", { status: 500 });

    await expect(handleOrvalResponse(res)).rejects.toThrow(
      "API request failed: 500",
    );
  });

  it("成功レスポンスのボディが壊れた JSON でも例外を投げず空オブジェクトを返す", async () => {
    const res = new Response("<<not json>>", { status: 200 });

    const result = await handleOrvalResponse<{ data: unknown }>(res);

    expect(result.data).toEqual({});
  });

  it("本文を持たない成功レスポンスでは data を空オブジェクトにする", async () => {
    const res = new Response(null, { status: 204 });

    const result = await handleOrvalResponse<{ data: unknown; status: number }>(
      res,
    );

    expect(result.data).toEqual({});
    expect(result.status).toBe(204);
  });

  it("画像レスポンスでは data に画像データを載せて返す", async () => {
    const res = new Response(new Uint8Array([1, 2, 3]), {
      status: 200,
      headers: { "Content-Type": "image/jpeg" },
    });

    const result = await handleOrvalResponse<{ data: Blob }>(res);

    expect(result.data).toBeInstanceOf(Blob);
  });
});

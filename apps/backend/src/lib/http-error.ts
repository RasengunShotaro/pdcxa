import { HTTPException } from "hono/http-exception";

export const 予期しないエラーメッセージ = "予期しないエラーが発生しました";

export const 境界エラーレスポンス = (error: unknown): Response =>
  error instanceof HTTPException
    ? error.getResponse()
    : new Response(予期しないエラーメッセージ, {
        status: 500,
        headers: { "content-type": "text/plain; charset=UTF-8" },
      });

import { vValidator } from "@hono/valibot-validator";
import { Hono } from "hono";
import { handle } from "hono/vercel";
import * as v from "valibot";

export const runtime = "edge";

const compressImageSchema = v.object({
  image: v.pipe(
    v.file("画像ファイルを選択してください"),
    v.maxSize(5 * 1024 * 1024, "ファイルサイズは5MB以下にしてください")
  ),
});

type Bindings = {
  BFF: Fetcher;
};

const app = new Hono<{ Bindings: Bindings }>()
  .basePath("/api")
  .post(
    "/compress-image",
    vValidator("form", compressImageSchema),
    async (c) => {
      try {
        const res = await c.env.BFF.fetch(c.req.raw);

        if (!res.ok) {
          throw new Error("画像の圧縮に失敗しました");
        }

        const compressedImageBuffer = await res.arrayBuffer();

        return c.body(compressedImageBuffer, 200, {
          "Content-Type": "image/webp",
          "Content-Length": compressedImageBuffer.byteLength.toString(),
        });
      } catch (error) {
        return c.json(
          {
            message: "画像の圧縮に失敗しました",
            error: error instanceof Error ? error.message : "不明なエラー",
          },
          500
        );
      }
    }
  );

export type AppType = typeof app;

export const GET = handle(app);
export const POST = handle(app);

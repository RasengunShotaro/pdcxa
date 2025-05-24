import { compressImage } from "@/utils/compress-image";
import { vValidator } from "@hono/valibot-validator";
import { Hono } from "hono";
import { handle } from "hono/vercel";
import * as v from "valibot";

const compressImageSchema = v.object({
  image: v.pipe(
    v.file("画像ファイルを選択してください"),
    v.maxSize(5 * 1024 * 1024, "ファイルサイズは5MB以下にしてください")
  ),
});

// 別ファイルに切り出したいが、app.route()を使うとRPCの型補完が効かないので、ベタ書き
const app = new Hono()
  .basePath("/api")
  .post(
    "/compress-image",
    vValidator("form", compressImageSchema),
    async (c) => {
      const data = c.req.valid("form");
      // const auth = getAuth(c);

      // if (!auth?.userId) {
      //   return c.json(
      //     {
      //       message: "認証されていません",
      //     },
      //     400
      //   );
      // }

      const image = data.image;

      try {
        const compressedImageBuffer = await compressImage({ input: image });

        return c.body(compressedImageBuffer, 200, {
          "Content-Type": "image/webp",
          "Content-Length": compressedImageBuffer.length.toString(),
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

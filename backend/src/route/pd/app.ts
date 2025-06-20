import { vValidator } from "@hono/valibot-validator";
import { Hono } from "hono";
import * as v from "valibot";
import { pds } from "@/db/schema";
import type { Bindings } from "@/lib/bindings";
import { db } from "@/lib/db";
import { ログイン中のユーザーを取得 } from "@/utils/current-user";
import { compressImage } from "./utils/compress-image";
import { fetchRawPds } from "./utils/fetch-raw-pds";
import { R2に画像をアップロードする } from "./utils/r2-utils";

const fetchPdSchema = v.object({
  pdId: v.optional(v.string()),
  userName: v.optional(v.string()),
  cursor: v.optional(v.string()),
});

const createPdSchema = v.object({
  content: v.pipe(
    v.string(),
    v.maxLength(200, "PDが長すぎます。200文字以内で入力してください"),
    v.minLength(1, "PDを入力してください")
  ),
  image: v.optional(v.instance(ArrayBuffer)),
});

export const pdApp = new Hono<Bindings>()
  .get("/", vValidator("query", fetchPdSchema), async (c) => {
    const clerkClient = c.get("clerk");
    const { pdId, userName, cursor } = c.req.valid("query");

    const PD詳細 = await fetchRawPds({
      pdId,
      userName,
      cursor,
      clerkClient,
      c,
    });

    return c.json(PD詳細, 200);
  })
  .post("/", vValidator("json", createPdSchema), async (c) => {
    const user = ログイン中のユーザーを取得(c);
    const { content, image } = c.req.valid("json");
    const compressedImage = image ? await compressImage({ image, c }) : null;
    const imageFileName = compressedImage
      ? await R2に画像をアップロードする({
          body: compressedImage,
          fileName: `${user.userId}-${Date.now()}`,
          contentType: "image/jpeg",
          extension: "jpeg",
          c,
        })
      : null;

    const newPd = {
      content,
      createdAt: new Date(),
      userId: `${user.userId}`,
      imageFileName: imageFileName,
    };

    await db.insert(pds).values(newPd);

    return c.json({ message: "PDが作成されました" }, 201);
  });

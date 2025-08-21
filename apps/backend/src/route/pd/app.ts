import { sValidator } from "@hono/standard-validator";
import { Hono } from "hono";
import * as v from "valibot";
import type { Bindings } from "../../lib/bindings";
import type { PD詳細 } from "./types/pd-detail";
import { GIFを含むPDを作成する } from "./utils/create-gif-pd";
import { PDを作成する } from "./utils/create-pd";
import { fetchRawPds } from "./utils/fetch-raw-pds";
import { PDのいいね状態を更新する } from "./utils/update-pd-like";

const fetchPdSchema = v.object({
  pdId: v.optional(v.string()),
  userName: v.optional(v.string()),
  cursor: v.optional(v.string()),
});

const createPdSchema = v.object({
  content: v.pipe(
    v.string(),
    v.maxLength(200, "PDが長すぎます。200文字以内で入力してください"),
    v.minLength(1, "PDを入力してください"),
  ),
  image: v.optional(
    v.pipe(
      v.union([v.file(), v.literal("undefined")]), // Formではundefinedではなく、文字列の"undefined"が送信されるため
      v.transform((input) => (input === "undefined" ? undefined : input)),
    ),
  ),
});
const createGifPdSchema = v.object({
  content: v.pipe(
    v.string(),
    v.maxLength(200, "PDが長すぎます。200文字以内で入力してください"),
    v.minLength(1, "PDを入力してください"),
  ),
  image: v.pipe(
    v.file(),
    v.check(
      (file) => file.type === "image/gif",
      "GIFファイルのみ対応しています",
    ),
  ),
});

const mutatePdLikeSchema = v.object({
  pdId: v.string(),
});

export const pdApp = new Hono<Bindings>()
  .get("/", sValidator("query", fetchPdSchema), async (c) => {
    const clerkClient = c.get("clerk");
    const { pdId, userName, cursor } = c.req.valid("query");

    const PD詳細: PD詳細 = await fetchRawPds({
      pdId,
      userName,
      cursor,
      clerkClient,
      c,
    });

    return c.json(PD詳細, 200);
  })
  .post("/create", sValidator("form", createPdSchema), async (c) => {
    const { content, image } = c.req.valid("form");

    await PDを作成する({ content, image, c });

    return c.json({ message: "PDが作成されました" }, 201);
  })
  .post("/create-gif", sValidator("form", createGifPdSchema), async (c) => {
    const { content, image } = c.req.valid("form");

    await GIFを含むPDを作成する({ content, image, c });

    return c.json({ message: "GIF付きPDが作成されました" }, 201);
  })
  .put("/like", sValidator("json", mutatePdLikeSchema), async (c) => {
    const { pdId } = c.req.valid("json");

    await PDのいいね状態を更新する({ pdId, c });

    return c.json({ message: "いいね状態を更新しました" }, 201);
  });

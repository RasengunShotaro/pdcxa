import { vValidator } from "@hono/valibot-validator";
import { Hono } from "hono";
import * as v from "valibot";
import type { Bindings } from "@/lib/bindings";
import type { PD詳細 } from "./types/pd-detail";
import { PDを作成する } from "./utils/create-pd";
import { fetchRawPds } from "./utils/fetch-raw-pds";
import { いいね状態を更新する } from "./utils/update-like";

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

const mutatePdLikeSchema = v.object({
  pdId: v.string(),
});

export const pdApp = new Hono<Bindings>()
  .get("/", vValidator("query", fetchPdSchema), async (c) => {
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
  .post("/create", vValidator("json", createPdSchema), async (c) => {
    const { content, image } = c.req.valid("json");

    await PDを作成する({ content, image, c });

    return c.json({ message: "PDが作成されました" }, 201);
  })
  .put("/like", vValidator("json", mutatePdLikeSchema), async (c) => {
    const { pdId } = c.req.valid("json");

    await いいね状態を更新する({ pdId, c });

    return c.json({ message: "いいね状態を更新しました" }, 201);
  });

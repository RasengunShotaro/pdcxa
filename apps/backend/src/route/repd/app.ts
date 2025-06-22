import { sValidator } from "@hono/standard-validator";
import { Hono } from "hono";
import * as v from "valibot";
import type { Bindings } from "../../lib/bindings";
import type { RePD詳細 } from "./types/repd-detail";
import { RePDを作成する } from "./utils/create-repd";
import { fetchRawRePds } from "./utils/fetch-raw-repds";
import { RePdのいいね状態を更新する } from "./utils/update-repd-like";

const fetchRePdSchema = v.object({
  pdId: v.string(),
});

const createRePdSchema = v.object({
  pdId: v.string(),
  content: v.pipe(
    v.string(),
    v.maxLength(200, "RePDが長すぎます。200文字以内で入力してください"),
    v.minLength(1, "RePDを入力してください")
  ),
});

const mutateRePdLikeSchema = v.object({
  rePdId: v.string(),
});

export const rePdApp = new Hono<Bindings>()
  .get("/", sValidator("query", fetchRePdSchema), async (c) => {
    const { pdId } = c.req.valid("query");

    const RePD詳細: RePD詳細 = await fetchRawRePds({
      pdId,
      c,
    });

    return c.json(RePD詳細, 200);
  })
  .post("/create", sValidator("json", createRePdSchema), async (c) => {
    const { pdId, content } = c.req.valid("json");

    await RePDを作成する({ pdId, content, c });

    return c.json({ message: "RePDが作成されました" }, 201);
  })
  .put("/like", sValidator("json", mutateRePdLikeSchema), async (c) => {
    const { rePdId } = c.req.valid("json");

    await RePdのいいね状態を更新する({ rePdId, c });

    return c.json({ message: "RePDのいいね状態を更新しました" }, 201);
  });

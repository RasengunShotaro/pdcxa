import { vValidator } from "@hono/valibot-validator";
import { Hono } from "hono";
import * as v from "valibot";
import { ユーザー名に紐づくユーザー詳細を取得 } from "./utils/fetch-user-detail";
import { ユーザーIDに紐づくユーザー詳細一覧を取得 } from "./utils/fetch-user-details";

const userDetailSchema = v.object({
  userName: v.string(),
});
const userDetailsSchema = v.object({
  userIds: v.union([v.array(v.string()), v.string()]), // 配列の要素数が1のときは、arrayではなくstringとみなされるため
});

export const userApp = new Hono()
  .get("/detail", vValidator("query", userDetailSchema), async (c) => {
    const clerkClient = c.get("clerk");

    const { userName } = c.req.valid("query");
    const ユーザー詳細 = await ユーザー名に紐づくユーザー詳細を取得({
      userName,
      clerkClient,
    });

    return c.json(ユーザー詳細, 200);
  })
  .get("/details", vValidator("query", userDetailsSchema), async (c) => {
    const clerkClient = c.get("clerk");

    const query = c.req.valid("query");
    const userIds =
      typeof query.userIds === "string" ? [query.userIds] : query.userIds;

    const userDetails = await ユーザーIDに紐づくユーザー詳細一覧を取得({
      userIds,
      clerkClient,
    });

    return c.json(userDetails, 200);
  });

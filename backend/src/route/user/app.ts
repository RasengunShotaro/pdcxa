import { vValidator } from "@hono/valibot-validator";
import { Hono } from "hono";
import * as v from "valibot";
import { ユーザー名に紐づくユーザー詳細を取得 } from "./utils/fetch-user-detail";
import { ユーザーIDに紐づくユーザー詳細一覧を取得 } from "./utils/fetch-user-details";

const userDetailSchema = v.object({
  userName: v.string(),
});
const userDetailsSchema = v.object({
  userIds: v.array(v.string()),
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

    const { userIds } = c.req.valid("query");
    const userDetails = await ユーザーIDに紐づくユーザー詳細一覧を取得({
      userIds,
      clerkClient,
    });

    return c.json(userDetails, 200);
  });

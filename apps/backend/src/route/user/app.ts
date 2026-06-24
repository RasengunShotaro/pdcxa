import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { jsonContent } from "../common/openapi";
import {
  userDetailQuerySchema,
  userDetailSchema,
  userDetailsQuerySchema,
  userDetailsSchema,
} from "./schema";
import { ユーザー名に紐づくユーザー詳細を取得 } from "./utils/fetch-user-detail";
import { ユーザーIDに紐づくユーザー詳細一覧を取得 } from "./utils/fetch-user-details";

const userDetailRoute = createRoute({
  operationId: "fetchUserDetail",
  method: "get",
  path: "/detail",
  request: { query: userDetailQuerySchema },
  responses: {
    200: jsonContent(userDetailSchema, "ユーザー詳細"),
  },
});

const userDetailsRoute = createRoute({
  operationId: "fetchUserDetails",
  method: "get",
  path: "/details",
  request: { query: userDetailsQuerySchema },
  responses: {
    200: jsonContent(userDetailsSchema, "ユーザー詳細一覧"),
  },
});

export const userApp = new OpenAPIHono()
  .openapi(userDetailRoute, async (c) => {
    const clerkClient = c.get("clerk");

    const { userName } = c.req.valid("query");
    const ユーザー詳細 = await ユーザー名に紐づくユーザー詳細を取得({
      userName,
      clerkClient,
    });

    return c.json(ユーザー詳細, 200);
  })
  .openapi(userDetailsRoute, async (c) => {
    const clerkClient = c.get("clerk");

    const { userIds } = c.req.valid("query");

    const userDetails = await ユーザーIDに紐づくユーザー詳細一覧を取得({
      userIds,
      clerkClient,
    });

    return c.json(userDetails, 200);
  });

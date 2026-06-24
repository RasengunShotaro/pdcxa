import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { jsonContent, messageSchema } from "../common/openapi";
import {
  createRePdSchema,
  fetchRePdQuerySchema,
  mutateRePdLikeSchema,
  rePdDetailSchema,
} from "./schema";
import { RePDを作成する } from "./utils/create-repd";
import { fetchRawRePds } from "./utils/fetch-raw-repds";
import { RePdのいいね状態を更新する } from "./utils/update-repd-like";

const fetchRePdRoute = createRoute({
  operationId: "fetchRePds",
  method: "get",
  path: "/",
  request: { query: fetchRePdQuerySchema },
  responses: {
    200: jsonContent(rePdDetailSchema, "RePD一覧"),
  },
});

const createRePdRoute = createRoute({
  operationId: "createRePd",
  method: "post",
  path: "/create",
  request: {
    body: {
      content: { "application/json": { schema: createRePdSchema } },
    },
  },
  responses: {
    201: jsonContent(messageSchema("RePDが作成されました"), "作成成功"),
  },
});

const mutateRePdLikeRoute = createRoute({
  operationId: "mutateRePdLike",
  method: "put",
  path: "/like",
  request: {
    body: {
      content: { "application/json": { schema: mutateRePdLikeSchema } },
    },
  },
  responses: {
    201: jsonContent(
      messageSchema("RePDのいいね状態を更新しました"),
      "更新成功",
    ),
  },
});

export const rePdApp = new OpenAPIHono()
  .openapi(fetchRePdRoute, async (c) => {
    const { pdId } = c.req.valid("query");
    const ログイン中のユーザーID = c.get("userId");

    const RePD詳細 = await fetchRawRePds({
      pdId,
      ログイン中のユーザーID,
    });

    return c.json(
      RePD詳細.map((item) => ({
        ...item,
        createdAt: item.createdAt.toISOString(),
      })),
      200,
    );
  })
  .openapi(createRePdRoute, async (c) => {
    const { pdId, content } = c.req.valid("json");
    const ログイン中のユーザーID = c.get("userId");

    await RePDを作成する({ pdId, content, ログイン中のユーザーID });

    return c.json({ message: "RePDが作成されました" }, 201);
  })
  .openapi(mutateRePdLikeRoute, async (c) => {
    const { rePdId } = c.req.valid("json");
    const ログイン中のユーザーID = c.get("userId");

    await RePdのいいね状態を更新する({ rePdId, ログイン中のユーザーID });

    return c.json({ message: "RePDのいいね状態を更新しました" }, 201);
  });

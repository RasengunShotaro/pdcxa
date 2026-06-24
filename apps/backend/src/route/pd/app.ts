import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { db } from "#/lib/db";
import type { Bindings } from "../../lib/bindings";
import { jsonContent, messageSchema } from "../common/openapi";
import {
  createGifPdFormSchema,
  createPdFormSchema,
  fetchPdQuerySchema,
  mutatePdLikeSchema,
  pdDetailSchema,
  weeklyStatsSchema,
} from "./schema";
import { GIFを含むPDを作成する } from "./utils/create-gif-pd";
import { PDを作成する } from "./utils/create-pd";
import { fetchRawPds } from "./utils/fetch-raw-pds";
import { PD週間統計を取得する } from "./utils/fetch-weekly-stats";
import { PDのいいね状態を更新する } from "./utils/update-pd-like";

const fetchPdRoute = createRoute({
  operationId: "fetchPds",
  method: "get",
  path: "/",
  request: { query: fetchPdQuerySchema },
  responses: {
    200: jsonContent(pdDetailSchema, "PD一覧"),
  },
});

const fetchWeeklyStatsRoute = createRoute({
  operationId: "fetchWeeklyStats",
  method: "get",
  path: "/stats/weekly",
  responses: {
    200: jsonContent(weeklyStatsSchema, "PD週間統計"),
  },
});

const createPdRoute = createRoute({
  operationId: "createPd",
  method: "post",
  path: "/create",
  request: {
    body: {
      content: { "multipart/form-data": { schema: createPdFormSchema } },
    },
  },
  responses: {
    201: jsonContent(messageSchema("PDが作成されました"), "作成成功"),
  },
});

const createGifPdRoute = createRoute({
  operationId: "createGifPd",
  method: "post",
  path: "/create-gif",
  request: {
    body: {
      content: { "multipart/form-data": { schema: createGifPdFormSchema } },
    },
  },
  responses: {
    201: jsonContent(messageSchema("GIF付きPDが作成されました"), "作成成功"),
  },
});

const mutatePdLikeRoute = createRoute({
  operationId: "mutatePdLike",
  method: "put",
  path: "/like",
  request: {
    body: {
      content: { "application/json": { schema: mutatePdLikeSchema } },
    },
  },
  responses: {
    201: jsonContent(messageSchema("いいね状態を更新しました"), "更新成功"),
  },
});

export const pdApp = new OpenAPIHono<Bindings>()
  .openapi(fetchPdRoute, async (c) => {
    const clerkClient = c.get("clerk");
    const ログイン中のユーザーID = c.get("userId");
    const { pdId, userName, cursor } = c.req.valid("query");

    const PD詳細 = await fetchRawPds({
      pdId,
      userName,
      cursor,
      clerkClient,
      ログイン中のユーザーID,
    });

    return c.json(
      {
        items: PD詳細.items.map((item) => ({
          ...item,
          createdAt: item.createdAt.toISOString(),
        })),
        nextCursor: PD詳細.nextCursor,
      },
      200,
    );
  })
  .openapi(fetchWeeklyStatsRoute, async (c) => {
    const 統計 = await PD週間統計を取得する();

    return c.json(統計, 200);
  })
  .openapi(createPdRoute, async (c) => {
    const { content, image } = c.req.valid("form");
    const ログイン中のユーザーID = c.get("userId");
    const R2 = c.env.R2;

    await PDを作成する({ content, image, ログイン中のユーザーID, R2 });

    return c.json({ message: "PDが作成されました" }, 201);
  })
  .openapi(createGifPdRoute, async (c) => {
    const { content, image } = c.req.valid("form");
    const ログイン中のユーザーID = c.get("userId");
    const R2 = c.env.R2;

    await GIFを含むPDを作成する({ content, image, ログイン中のユーザーID, R2 });

    return c.json({ message: "GIF付きPDが作成されました" }, 201);
  })
  .openapi(mutatePdLikeRoute, async (c) => {
    const { pdId } = c.req.valid("json");
    const ログイン中のユーザーID = c.get("userId");

    await PDのいいね状態を更新する({ pdId, ログイン中のユーザーID, db });

    return c.json({ message: "いいね状態を更新しました" }, 201);
  });

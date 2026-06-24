import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { Effect } from "effect";
import { AuthContext } from "#/domain/auth/principal";
import { ClerkClientPort } from "#/domain/clerk/client";
import { R2Storage } from "#/domain/storage/r2";
import { runtime } from "#/infrastructure/runtime";
import type { Bindings } from "#/lib/bindings";
import { GIFを含むPDを作成する } from "#/services/pd/create-gif-pd";
import { PDを作成する } from "#/services/pd/create-pd";
import { PD一覧を取得する } from "#/services/pd/fetch-pds";
import { PD週間統計を取得する } from "#/services/pd/fetch-weekly-stats";
import { PDのいいね状態を更新する } from "#/services/pd/update-pd-like";
import { jsonContent, messageSchema } from "../common/openapi";
import {
  createGifPdFormSchema,
  createPdFormSchema,
  fetchPdQuerySchema,
  mutatePdLikeSchema,
  pdDetailSchema,
  weeklyStatsSchema,
} from "./schema";

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
    const { pdId, userName, cursor } = c.req.valid("query");

    return runtime.runPromise(
      PD一覧を取得する({ pdId, userName, cursor }).pipe(
        Effect.map((result) =>
          c.json(
            {
              items: result.items.map((item) => ({
                ...item,
                createdAt: item.createdAt.toISOString(),
              })),
              nextCursor: result.nextCursor,
            },
            200,
          ),
        ),
        Effect.tapError((error) => Effect.logError(error.message)),
        Effect.provideService(AuthContext, { userId: c.get("userId") }),
        Effect.provideService(ClerkClientPort, c.get("clerk")),
      ),
    );
  })
  .openapi(fetchWeeklyStatsRoute, async (c) =>
    runtime.runPromise(
      PD週間統計を取得する().pipe(
        Effect.map((統計) => c.json(統計, 200)),
        Effect.tapError((error) => Effect.logError(error.message)),
      ),
    ),
  )
  .openapi(createPdRoute, async (c) => {
    const { content, image } = c.req.valid("form");

    return runtime.runPromise(
      PDを作成する({ content, image }).pipe(
        Effect.map(() => c.json({ message: "PDが作成されました" }, 201)),
        Effect.tapError((error) => Effect.logError(error.message)),
        Effect.provideService(AuthContext, { userId: c.get("userId") }),
        Effect.provideService(R2Storage, c.env.R2),
      ),
    );
  })
  .openapi(createGifPdRoute, async (c) => {
    const { content, image } = c.req.valid("form");

    return runtime.runPromise(
      GIFを含むPDを作成する({ content, image }).pipe(
        Effect.map(() => c.json({ message: "GIF付きPDが作成されました" }, 201)),
        Effect.tapError((error) => Effect.logError(error.message)),
        Effect.provideService(AuthContext, { userId: c.get("userId") }),
        Effect.provideService(R2Storage, c.env.R2),
      ),
    );
  })
  .openapi(mutatePdLikeRoute, async (c) => {
    const { pdId } = c.req.valid("json");

    return runtime.runPromise(
      PDのいいね状態を更新する({ pdId }).pipe(
        Effect.map(() => c.json({ message: "いいね状態を更新しました" }, 201)),
        Effect.tapError((error) => Effect.logError(error.message)),
        Effect.provideService(AuthContext, { userId: c.get("userId") }),
      ),
    );
  });

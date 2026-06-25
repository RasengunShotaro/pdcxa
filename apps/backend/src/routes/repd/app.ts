import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { Effect } from "effect";
import { AuthContext } from "#/domain/auth/principal";
import { runtime } from "#/infrastructure/runtime";
import { RePDを作成する } from "#/services/repd/create-repd";
import { RePD一覧を取得する } from "#/services/repd/fetch-repds";
import { RePDのいいね状態を更新する } from "#/services/repd/update-repd-like";
import { jsonContent, messageSchema } from "../common/openapi";
import {
  createRePdSchema,
  fetchRePdQuerySchema,
  mutateRePdLikeSchema,
  rePdDetailSchema,
} from "./schema";

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

    return runtime.runPromise(
      RePD一覧を取得する({ pdId }).pipe(
        Effect.map((items) =>
          c.json(
            items.map((item) => ({
              ...item,
              createdAt: item.createdAt.toISOString(),
            })),
            200,
          ),
        ),
        Effect.tapError((error) => Effect.logError(error.message)),
        Effect.provideService(AuthContext, { userId: c.get("userId") }),
      ),
    );
  })
  .openapi(createRePdRoute, async (c) => {
    const { pdId, content } = c.req.valid("json");

    return runtime.runPromise(
      RePDを作成する({ pdId, content }).pipe(
        Effect.map(() => c.json({ message: "RePDが作成されました" }, 201)),
        Effect.tapError((error) => Effect.logError(error.message)),
        Effect.provideService(AuthContext, { userId: c.get("userId") }),
      ),
    );
  })
  .openapi(mutateRePdLikeRoute, async (c) => {
    const { rePdId } = c.req.valid("json");

    return runtime.runPromise(
      RePDのいいね状態を更新する({ rePdId }).pipe(
        Effect.map(() =>
          c.json({ message: "RePDのいいね状態を更新しました" }, 201),
        ),
        Effect.tapError((error) => Effect.logError(error.message)),
        Effect.provideService(AuthContext, { userId: c.get("userId") }),
      ),
    );
  });

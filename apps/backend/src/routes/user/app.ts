import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { Effect } from "effect";
import { ClerkClientPort } from "#/domain/clerk/client";
import { UserDirectory } from "#/domain/user/service";
import { runtime } from "#/infrastructure/runtime";
import { jsonContent } from "../common/openapi";
import {
  userDetailQuerySchema,
  userDetailSchema,
  userDetailsQuerySchema,
  userDetailsSchema,
} from "./schema";

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
    const { userName } = c.req.valid("query");

    return runtime.runPromise(
      Effect.gen(function* () {
        const directory = yield* UserDirectory;
        return yield* directory.ユーザー名で取得する(userName);
      }).pipe(
        Effect.map((detail) => c.json(detail, 200)),
        Effect.tapError((error) => Effect.logError(error.message)),
        Effect.provideService(ClerkClientPort, c.get("clerk")),
      ),
    );
  })
  .openapi(userDetailsRoute, async (c) => {
    const { userIds } = c.req.valid("query");

    return runtime.runPromise(
      Effect.gen(function* () {
        const directory = yield* UserDirectory;
        return yield* directory.ユーザーID一覧で取得する(userIds);
      }).pipe(
        Effect.map((details) => c.json(details, 200)),
        Effect.tapError((error) => Effect.logError(error.message)),
        Effect.provideService(ClerkClientPort, c.get("clerk")),
      ),
    );
  });

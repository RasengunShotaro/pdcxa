import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { Effect } from "effect";
import { AuthContext } from "#/domain/auth/principal";
import { ClerkClientPort } from "#/domain/clerk/client";
import { runtime } from "#/infrastructure/runtime";
import type { Bindings } from "#/lib/bindings";
import { 通知一覧を取得する } from "#/services/notification/fetch-notifications";
import { 通知の未読件数を取得する } from "#/services/notification/fetch-unread-count";
import { 通知を既読にする } from "#/services/notification/mark-seen";
import { jsonContent } from "../common/openapi";
import {
  markSeenSchema,
  notificationListQuerySchema,
  notificationListSchema,
  unreadCountSchema,
} from "./schema";

const fetchUnreadCountRoute = createRoute({
  operationId: "fetchNotificationUnreadCount",
  method: "get",
  path: "/unread-count",
  responses: {
    200: jsonContent(unreadCountSchema, "未読通知件数"),
  },
});

const fetchNotificationsRoute = createRoute({
  operationId: "fetchNotifications",
  method: "get",
  path: "/",
  request: { query: notificationListQuerySchema },
  responses: {
    200: jsonContent(notificationListSchema, "通知一覧"),
  },
});

const markSeenRoute = createRoute({
  operationId: "markNotificationsSeen",
  method: "post",
  path: "/seen",
  responses: {
    200: jsonContent(markSeenSchema, "既読化成功"),
  },
});

export const notificationApp = new OpenAPIHono<Bindings>()
  .openapi(fetchUnreadCountRoute, async (c) =>
    runtime.runPromise(
      通知の未読件数を取得する().pipe(
        Effect.map((result) => c.json(result, 200)),
        Effect.tapError((error) => Effect.logError(error.message)),
        Effect.provideService(AuthContext, { userId: c.get("userId") }),
      ),
    ),
  )
  .openapi(fetchNotificationsRoute, async (c) => {
    const { cursor } = c.req.valid("query");

    return runtime.runPromise(
      通知一覧を取得する({ cursor }).pipe(
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
  .openapi(markSeenRoute, async (c) =>
    runtime.runPromise(
      通知を既読にする({ seenAt: new Date() }).pipe(
        Effect.map(() => c.json({ ok: true }, 200)),
        Effect.tapError((error) => Effect.logError(error.message)),
        Effect.provideService(AuthContext, { userId: c.get("userId") }),
      ),
    ),
  );

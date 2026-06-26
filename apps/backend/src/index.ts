import { clerkMiddleware } from "@hono/clerk-auth";
import { OpenAPIHono } from "@hono/zod-openapi";
import type { MiddlewareHandler } from "hono";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { ログイン中のユーザーIDを取得 } from "./lib/current-user";
import { 境界エラーレスポンス } from "./lib/http-error";
import { キャッシュ無効化Middleware } from "./lib/no-store";
import { invitationApp } from "./routes/invitation/app";
import { notificationApp } from "./routes/notification/app";
import { pdApp } from "./routes/pd/app";
import { rePdApp } from "./routes/repd/app";
import { userApp } from "./routes/user/app";

declare module "hono" {
  interface ContextVariableMap {
    userId: string;
  }
}

export const ログイン状態Middleware: MiddlewareHandler = async (c, next) => {
  const userId = ログイン中のユーザーIDを取得(c);
  if (!userId) {
    throw new HTTPException(401, { message: "ログインしていません" });
  }
  c.set("userId", userId);
  await next();
};

const app = new OpenAPIHono();
app.use("*", キャッシュ無効化Middleware);
app.use("*", clerkMiddleware());
app.use("*", async (c, next) => {
  const corsMiddlewareHandler = cors({
    origin: "*",
  });
  return corsMiddlewareHandler(c, next);
});
app.use("*", ログイン状態Middleware);
app.onError((エラー) => 境界エラーレスポンス(エラー));

export const ルート = app
  .route("/invitation", invitationApp)
  .route("/user", userApp)
  .route("/pd", pdApp)
  .route("/repd", rePdApp)
  .route("/notifications", notificationApp);

export const openApiDocument = () =>
  ルート.getOpenAPIDocument({
    openapi: "3.1.0",
    info: {
      title: "PDCXA API",
      version: "1.0.0",
    },
  });

ルート.doc("/doc", {
  openapi: "3.1.0",
  info: {
    title: "PDCXA API",
    version: "1.0.0",
  },
});

export default {
  port: 8787,
  fetch: app.fetch,
};

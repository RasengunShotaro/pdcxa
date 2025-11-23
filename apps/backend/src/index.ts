import { clerkMiddleware } from "@hono/clerk-auth";
import { Hono, type MiddlewareHandler } from "hono";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { invitationApp } from "./route/invitation/app";
import { pdApp } from "./route/pd/app";
import { rePdApp } from "./route/repd/app";
import { userApp } from "./route/user/app";
import { ログイン中のユーザーIDを取得 } from "./utils/current-user";

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

const app = new Hono();
app.use("*", clerkMiddleware());
app.use("*", async (c, next) => {
  const corsMiddlewareHandler = cors({
    origin: "*",
  });
  return corsMiddlewareHandler(c, next);
});
app.use("*", ログイン状態Middleware);
app.onError((エラー) => {
  throw new HTTPException(500, { message: エラー.message });
});

export const ルート = app
  .route("/invitation", invitationApp)
  .route("/user", userApp)
  .route("/pd", pdApp)
  .route("/repd", rePdApp);

export default {
  port: 8787,
  fetch: app.fetch,
};

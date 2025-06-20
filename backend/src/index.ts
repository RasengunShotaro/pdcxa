import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { Hono, type MiddlewareHandler } from "hono";
import { cors } from "hono/cors";
import { invitationApp } from "./route/invitation/app";
import { pdApp } from "./route/pd/app";
import { userApp } from "./route/user/app";

type ErrorResponse = {
  message: string;
};

export const ログイン状態Middleware: MiddlewareHandler = async (c, next) => {
  const auth = getAuth(c);
  const userId = auth?.userId;
  if (!userId) {
    return c.json<ErrorResponse>({ message: "ログインしていないです" }, 401);
  }
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
app.onError((エラー, c) => {
  return c.json<ErrorResponse>({ message: エラー.message }, 500);
});

const ルート = app
  .route("/invitation", invitationApp)
  .route("/user", userApp)
  .route("/pd", pdApp);

export type AppType = typeof ルート;

export default {
  port: 8787,
  fetch: app.fetch,
};

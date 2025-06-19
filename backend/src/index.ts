import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { vValidator } from "@hono/valibot-validator";
import { Hono, type MiddlewareHandler } from "hono";
import { cors } from "hono/cors";
import * as v from "valibot";

type ErrorResponse = {
  message: string;
};

const schema = v.object({
  emailAddress: v.string(),
});

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

const invitationApp = new Hono().post(
  "/create",
  vValidator("json", schema),
  async (c) => {
    const clerkClient = c.get("clerk");

    const body = c.req.valid("json");
    await clerkClient.invitations.createInvitation({
      emailAddress: body.emailAddress,
      ignoreExisting: true,
    });

    return c.json(
      {
        message: "招待を作成しました",
      },
      200
    );
  }
);

const ルート = app.route("/invitation", invitationApp);

export type AppType = typeof ルート;

export default {
  port: 8787,
  fetch: app.fetch,
};

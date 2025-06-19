import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { vValidator } from "@hono/valibot-validator";
import { Hono, type MiddlewareHandler } from "hono";
import { cors } from "hono/cors";
import * as v from "valibot";

const schema = v.object({
  emailAddress: v.string(),
});

export const エラーレスポンスMiddleware: MiddlewareHandler = async (
  _,
  next
) => {
  try {
    await next();
  } catch (err) {
    if (err instanceof Response) {
      return err;
    }
  }
};

export const ログイン状態Middleware: MiddlewareHandler = async (c, next) => {
  const auth = getAuth(c);
  const userId = auth?.userId;
  if (!userId) {
    throw c.json(
      {
        message: "ログインしていません。",
      },
      400
    );
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
app.use("*", エラーレスポンスMiddleware);
app.use("*", ログイン状態Middleware);

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

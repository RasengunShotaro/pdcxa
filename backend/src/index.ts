import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono();
app.use("*", clerkMiddleware());
app.use("*", async (c, next) => {
  const corsMiddlewareHandler = cors({
    origin: "*",
  });
  return corsMiddlewareHandler(c, next);
});

const invitationApp = new Hono().post("/create", async (c) => {
  const clerkClient = c.get("clerk");
  const auth = getAuth(c);

  const userId = auth?.userId;
  if (!userId) {
    return c.json(
      {
        message: "ログインしていないです",
      },
      400
    );
  }

  const body: { emailAddress: string } = await c.req.raw.json();
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
});

const ルート = app.route("/invitation", invitationApp);

export type AppType = typeof ルート;

export default {
  port: 8787,
  fetch: app.fetch,
};

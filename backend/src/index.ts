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

app.get("/", (c) => {
  const auth = getAuth(c);

  if (!auth?.userId) {
    return c.json({
      message: "You are not logged in.",
    });
  }

  return c.json({
    message: "You are logged in!",
    userId: auth.userId,
  });
});

export default {
  port: 8787,
  fetch: app.fetch,
};

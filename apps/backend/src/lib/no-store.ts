import type { MiddlewareHandler } from "hono";

export const キャッシュ無効化Middleware: MiddlewareHandler = async (
  c,
  next,
) => {
  await next();
  if (!c.res.headers.has("Cache-Control")) {
    c.res.headers.set("Cache-Control", "no-store");
  }
};

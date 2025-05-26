import { Hono } from "hono";
import { env } from "hono/adapter";
import { handle } from "hono/vercel";

export const runtime = "edge";

const app = new Hono().basePath("/api").get("/", async (c) => {
  try {
    const { BFF } = env<{
      BFF: Fetcher;
    }>(c);
    const res = await BFF.fetch(c.req.raw);

    return c.body(await res.text(), 200);
  } catch (error) {
    return c.json(
      {
        message: error instanceof Error ? error.message : "不明なエラー",
      },
      500
    );
  }
});

export type AppType = typeof app;

export const GET = handle(app);
export const POST = handle(app);

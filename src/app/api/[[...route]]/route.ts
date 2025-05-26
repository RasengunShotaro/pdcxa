import { Hono } from "hono";
import { handle } from "hono/vercel";

export const runtime = "edge";

type Bindings = {
  BFF: Fetcher;
};

const app = new Hono<{ Bindings: Bindings }>()
  .basePath("/api")
  .get("/", async (c) => {
    try {
      const res = await c.env.BFF.fetch(c.req.raw);

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

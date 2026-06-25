import { Hono } from "hono";
import { describe, expect, it } from "vitest";
import { キャッシュ無効化Middleware } from "./no-store";

describe("キャッシュ無効化Middleware", () => {
  it("Cache-Control 未設定のレスポンスに no-store を付与する", async () => {
    const app = new Hono();
    app.use("*", キャッシュ無効化Middleware);
    app.get("/data", (c) => c.json({ ok: true }));

    const res = await app.request("/data");

    expect(res.headers.get("Cache-Control")).toBe("no-store");
  });

  it("既に Cache-Control があるレスポンスは上書きしない", async () => {
    const app = new Hono();
    app.use("*", キャッシュ無効化Middleware);
    app.get("/image", (c) =>
      c.body("x", 200, {
        "Cache-Control": "private, max-age=31536000, immutable",
      }),
    );

    const res = await app.request("/image");

    expect(res.headers.get("Cache-Control")).toBe(
      "private, max-age=31536000, immutable",
    );
  });
});

import { Hono } from "hono";
import { describe, expect, it } from "vitest";
import { CORSMiddleware } from "./cors";

const aPreflightRequest = () =>
  new Request("http://localhost/pd", {
    method: "OPTIONS",
    headers: {
      Origin: "https://pdcxa.com",
      "Access-Control-Request-Method": "GET",
      "Access-Control-Request-Headers": "authorization",
    },
  });

describe("CORSMiddleware", () => {
  it("preflight の応答をブラウザに 2 時間キャッシュさせる", async () => {
    const app = new Hono();
    app.use("*", CORSMiddleware);
    app.get("/pd", (c) => c.json({ ok: true }));

    const res = await app.request(aPreflightRequest());

    expect(res.headers.get("Access-Control-Max-Age")).toBe("7200");
  });

  it("どのオリジンからのリクエストも許可する", async () => {
    const app = new Hono();
    app.use("*", CORSMiddleware);
    app.get("/pd", (c) => c.json({ ok: true }));

    const res = await app.request(aPreflightRequest());

    expect(res.headers.get("Access-Control-Allow-Origin")).toBe("*");
  });
});

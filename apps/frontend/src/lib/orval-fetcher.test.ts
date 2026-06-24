import { afterEach, describe, expect, it } from "bun:test";
import { orvalFetch } from "./orval-fetcher";

const originalFetch = globalThis.fetch;

const stubFetch = (response: Response) => {
  globalThis.fetch = Object.assign(async () => response, {
    preconnect: () => {},
  });
};

afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe("orvalFetch", () => {
  it("2xx の JSON ボディを data に載せて返す", async () => {
    stubFetch(new Response(JSON.stringify({ message: "ok" }), { status: 200 }));

    const result = await orvalFetch<{ data: { message: string } }>("/pd");

    expect(result.data).toEqual({ message: "ok" });
  });

  it("非 2xx では例外を投げる", async () => {
    stubFetch(new Response("internal error", { status: 500 }));

    expect(orvalFetch("/pd/create", { method: "POST" })).rejects.toThrow(
      "API request failed: 500",
    );
  });

  it("壊れた JSON ボディでも例外を投げず空オブジェクトを返す", async () => {
    stubFetch(new Response("<<not json>>", { status: 200 }));

    const result = await orvalFetch<{ data: unknown }>("/pd");

    expect(result.data).toEqual({});
  });

  it("204 No Content では data を空オブジェクトにする", async () => {
    stubFetch(new Response(null, { status: 204 }));

    const result = await orvalFetch<{ data: unknown; status: number }>("/pd", {
      method: "PUT",
    });

    expect(result.data).toEqual({});
    expect(result.status).toBe(204);
  });
});

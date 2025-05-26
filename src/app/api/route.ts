import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = "edge";

async function handleRequest(request: Request) {
  const bff = getRequestContext().env.BFF;

  const url = new URL(request.url);
  const headers = new Headers(request.headers);

  const bffRequest = new Request(url.pathname + url.search, {
    method: request.method,
    headers: headers,
  });

  const res = await bff.fetch(bffRequest);

  return res;
}

export async function GET(request: Request) {
  return handleRequest(request);
}

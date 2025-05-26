import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = "edge";

async function handleRequest(request: Request) {
  const bff = getRequestContext().env.BFF;

  const res = await bff.add(2, 2);

  return res.toString();
}

export async function GET(request: Request) {
  return handleRequest(request);
}

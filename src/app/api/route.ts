import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = "edge";

async function handleRequest(request: Request) {
  try {
    const bff = getRequestContext().env.BFF;

    const res = await bff.add(2, 2);

    return Response.json({ res: res });
  } catch (error) {
    return new Response(
      error instanceof Error ? error.message : "不明なエラー",
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  return handleRequest(request);
}

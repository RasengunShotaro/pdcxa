import { HttpResponse, http } from "msw";
import { getCreatePdResponseMock } from "@/schema/api.msw";
import { 開発用のあしあとを作る } from "./dev-footprint";
import { 開発用の週間統計 } from "./dev-stats";
import {
  開発用のPDを探す,
  開発用のタイムラインを1ページ分返す,
  開発用の投稿者たち,
} from "./dev-timeline";

export const 開発用のタイムラインのハンドラ = [
  http.post("*/pd/create", () =>
    HttpResponse.json(
      {
        ...getCreatePdResponseMock(),
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      },
      { status: 201 },
    ),
  ),
  http.get("*/pd/stats/weekly", () => HttpResponse.json(開発用の週間統計)),
  http.get("*/pd/stats/footprint", () =>
    HttpResponse.json(
      開発用のあしあとを作る(new Date().toISOString().slice(0, 10)),
    ),
  ),
  http.get("*/pd", ({ request }) => {
    const params = new URL(request.url).searchParams;
    const pdId = params.get("pdId");
    if (pdId) {
      const pd = 開発用のPDを探す(pdId);
      return HttpResponse.json({ items: pd ? [pd] : [] });
    }
    if (params.get("userName")) return undefined;
    return HttpResponse.json(
      開発用のタイムラインを1ページ分返す({ cursor: params.get("cursor") }),
    );
  }),
  http.get("*/user/details", () =>
    HttpResponse.json(
      開発用の投稿者たち.map((author) => ({
        ...author,
        imageUrl: "",
        badges: author.id === "user_2abc" ? ["originator"] : [],
      })),
    ),
  ),
  http.get<{ fileName: string }>("*/pd/image/:fileName", async ({ params }) => {
    const image = await fetch(`/${params.fileName}`);
    return new HttpResponse(await image.arrayBuffer(), {
      headers: { "Content-Type": "image/webp" },
    });
  }),
];

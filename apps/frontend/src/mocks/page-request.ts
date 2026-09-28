import { http, passthrough } from "msw";

interface RequestWithHeaders {
  headers: Headers;
}

export const 画面遷移のリクエストか = ({
  headers,
}: RequestWithHeaders): boolean => headers.has("RSC");

export const 画面遷移はモックせずに通す = http.all("*", ({ request }) =>
  画面遷移のリクエストか(request) ? passthrough() : undefined,
);

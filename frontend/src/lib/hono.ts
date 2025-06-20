"use server";

import { auth } from "@clerk/nextjs/server";
import { hc } from "hono/client";
import type { AppType } from "@/../../backend/src";

type FetchArgs = Parameters<typeof fetch>;
type エラー時のレスポンス = {
  message: string;
};

const baseUrl = process.env.BASE_URL;
if (!baseUrl) {
  throw new Error("バックエンドのURLが設定されていません");
}

const fetcher = async (input: FetchArgs[0], init: FetchArgs[1]) => {
  const response = await fetch(input, init);

  if (!response.ok) {
    const json = (await response.json()) as エラー時のレスポンス;
    const エラーメッセージ = json.message || "不明なエラー";

    throw new Error(`エラーが発生しました: ${エラーメッセージ}`);
  }

  return response;
};

export const getClient = async () => {
  const token = await (await auth()).getToken();
  if (!token) {
    throw new Error("ログインしていません");
  }

  return hc<AppType>(baseUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    fetch: fetcher,
  });
};

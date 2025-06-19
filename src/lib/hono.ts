"use server";

import { auth } from "@clerk/nextjs/server";
import { hc } from "hono/client";
import type { AppType } from "@/../backend/src/index";

const baseUrl = process.env.BASE_URL;
if (!baseUrl) {
  throw new Error("バックエンドのURLが設定されていません");
}

export const getClient = async () => {
  const token = await (await auth()).getToken();
  if (!token) {
    throw new Error("ログインしていません");
  }

  return hc<AppType>(baseUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
  });
};

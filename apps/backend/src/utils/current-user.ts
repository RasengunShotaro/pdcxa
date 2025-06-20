import { getAuth } from "@hono/clerk-auth";
import type { Context } from "hono";

export const ログイン中のユーザーを取得 = (c: Context) => {
  const user = getAuth(c);
  if (!user) {
    throw new Error("ユーザーが認証されていません。");
  }

  return user;
};

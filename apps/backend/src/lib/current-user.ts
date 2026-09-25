import { getAuth } from "@clerk/hono";
import type { Context } from "hono";

export const ログイン中のユーザーIDを取得 = (c: Context) => {
  const user = getAuth(c)?.userId;
  return user;
};

import type { Context } from "hono";
import { rePds } from "@/db/schema";
import { db } from "@/lib/db";
import { ログイン中のユーザーを取得 } from "@/utils/current-user";

export const RePDを作成する = async ({
  pdId,
  content,
  c,
}: {
  pdId: string;
  content: string;
  c: Context;
}) => {
  const user = ログイン中のユーザーを取得(c);

  const newRePd = {
    pdId,
    content,
    createdAt: new Date(),
    userId: `${user.userId}`,
  };

  await db.insert(rePds).values(newRePd);

  return;
};

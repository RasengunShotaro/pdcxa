import { and, eq } from "drizzle-orm";
import type { Context } from "hono";
import { pdLikes } from "@/db/schema";
import { db } from "@/lib/db";
import { ログイン中のユーザーを取得 } from "@/utils/current-user";

export const PDのいいね状態を更新する = async ({
  pdId,
  c,
}: {
  pdId: string;
  c: Context;
}) => {
  const ログイン中のユーザーID = ログイン中のユーザーを取得(c).userId;
  if (!ログイン中のユーザーID) {
    throw new Error("ログインしていないです");
  }

  const existingLike = await db
    .select()
    .from(pdLikes)
    .where(
      and(
        eq(pdLikes.userId, ログイン中のユーザーID),
        eq(pdLikes.targetPdId, pdId)
      )
    )
    .limit(1);

  if (existingLike.length > 0) {
    await db
      .delete(pdLikes)
      .where(
        and(
          eq(pdLikes.userId, ログイン中のユーザーID),
          eq(pdLikes.targetPdId, pdId)
        )
      );
  } else {
    await db.insert(pdLikes).values({
      userId: ログイン中のユーザーID,
      targetPdId: pdId,
    });
  }

  return;
};

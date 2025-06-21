import { and, eq } from "drizzle-orm";
import type { Context } from "hono";
import { rePdLikes } from "../../../db/schema";
import { db } from "../../../lib/db";
import { ログイン中のユーザーを取得 } from "../../../utils/current-user";

export const RePdのいいね状態を更新する = async ({
  rePdId,
  c,
}: {
  rePdId: string;
  c: Context;
}) => {
  const ログイン中のユーザーID = ログイン中のユーザーを取得(c).userId;
  if (!ログイン中のユーザーID) {
    throw new Error("ログインしていないです");
  }

  const existingLike = await db
    .select()
    .from(rePdLikes)
    .where(
      and(
        eq(rePdLikes.targetRePdId, rePdId),
        eq(rePdLikes.userId, ログイン中のユーザーID)
      )
    );

  if (existingLike.length > 0) {
    await db
      .delete(rePdLikes)
      .where(
        and(
          eq(rePdLikes.targetRePdId, rePdId),
          eq(rePdLikes.userId, ログイン中のユーザーID)
        )
      );
    return;
  }

  const newRePdLike = {
    targetRePdId: rePdId,
    userId: ログイン中のユーザーID,
  };

  await db.insert(rePdLikes).values(newRePdLike);

  return;
};

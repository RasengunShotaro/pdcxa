import { and, eq } from "drizzle-orm";
import { rePdLikes } from "../../../db/schema";
import { db } from "../../../lib/db";

export const RePdのいいね状態を更新する = async ({
  rePdId,
  ログイン中のユーザーID,
}: {
  rePdId: string;
  ログイン中のユーザーID: string;
}) => {
  const existingLike = await db
    .select()
    .from(rePdLikes)
    .where(
      and(
        eq(rePdLikes.targetRePdId, rePdId),
        eq(rePdLikes.userId, ログイン中のユーザーID),
      ),
    );

  if (existingLike.length > 0) {
    await db
      .delete(rePdLikes)
      .where(
        and(
          eq(rePdLikes.targetRePdId, rePdId),
          eq(rePdLikes.userId, ログイン中のユーザーID),
        ),
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

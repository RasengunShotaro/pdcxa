import { and, eq } from "drizzle-orm";
import type { DbClient } from "#/lib/db";
import { pdLikes } from "../../../db/schema";

export const PDのいいね状態を更新する = async ({
  pdId,
  ログイン中のユーザーID,
  db,
}: {
  pdId: string;
  ログイン中のユーザーID: string;
  db: DbClient;
}) => {
  const existingLike = await db
    .select()
    .from(pdLikes)
    .where(
      and(
        eq(pdLikes.userId, ログイン中のユーザーID),
        eq(pdLikes.targetPdId, pdId),
      ),
    )
    .limit(1);

  if (existingLike.length > 0) {
    await db
      .delete(pdLikes)
      .where(
        and(
          eq(pdLikes.userId, ログイン中のユーザーID),
          eq(pdLikes.targetPdId, pdId),
        ),
      );
  } else {
    await db.insert(pdLikes).values({
      userId: ログイン中のユーザーID,
      targetPdId: pdId,
    });
  }

  return;
};

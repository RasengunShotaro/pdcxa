"use server";

import { pdLikes } from "@/db/schema";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";

export const mutatePdLike = async (pdId: string) => {
  const user = await currentUser();
  if (!user) {
    throw new Error("ユーザーが認証されていません。");
  }
  const userId = user.id;

  try {
    const existingLike = await db
      .select()
      .from(pdLikes)
      .where(and(eq(pdLikes.userId, userId), eq(pdLikes.targetPdId, pdId)))
      .limit(1);

    if (existingLike.length > 0) {
      await db
        .delete(pdLikes)
        .where(and(eq(pdLikes.userId, userId), eq(pdLikes.targetPdId, pdId)));
    } else {
      await db.insert(pdLikes).values({
        userId,
        targetPdId: pdId,
      });
    }

    return;
  } catch (error) {
    console.error("いいねの更新に失敗しました:", error);
    throw error;
  }
};

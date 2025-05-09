"use server";

import { rePdLikes } from "@/db/schema";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";

export const mutateRePdLike = async (rePdId: string) => {
  const user = await currentUser();
  if (!user) {
    throw new Error("ユーザーが認証されていません。");
  }
  const userId = user.id;

  const existingLike = await db
    .select()
    .from(rePdLikes)
    .where(
      and(eq(rePdLikes.targetRePdId, rePdId), eq(rePdLikes.userId, userId))
    );

  if (existingLike.length > 0) {
    await db
      .delete(rePdLikes)
      .where(
        and(eq(rePdLikes.targetRePdId, rePdId), eq(rePdLikes.userId, userId))
      );
    return;
  }

  const newRePdLike = {
    targetRePdId: rePdId,
    userId: `${userId}`,
  };

  await db.insert(rePdLikes).values(newRePdLike);

  return;
};

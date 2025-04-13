"use server";

import { rePdLikes } from "@/db/schema";
import { db } from "@/lib/db";
import { and, eq } from "drizzle-orm";
import type { Like } from "../../types";

export const mutateRePdLike = async (
  userId: string,
  rePdId: string
): Promise<Like | null> => {
  try {
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
      return null;
    }

    const newRePdLike = {
      targetRePdId: rePdId,
      userId: `${userId}`,
    };

    const [insertedRePdLike] = await db
      .insert(rePdLikes)
      .values(newRePdLike)
      .returning({
        userId: rePdLikes.userId,
        pdId: rePdLikes.targetRePdId,
      });

    return {
      userId: insertedRePdLike.userId,
      pdId: insertedRePdLike.pdId,
    };
  } catch (error) {
    console.error("RePDLikeの操作に失敗しました:", error);
    throw error;
  }
};

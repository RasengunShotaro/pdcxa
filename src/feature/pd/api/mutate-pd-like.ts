"use server";

import { pdLikes } from "@/db/schema";
import { db } from "@/lib/db";
import { and, eq } from "drizzle-orm";
import type { Like } from "../types";

export const mutatePdLike = async (
  userId: string,
  pdId: string
): Promise<Like | null> => {
  try {
    const existingLike = await db
      .select()
      .from(pdLikes)
      .where(and(eq(pdLikes.targetPdId, pdId), eq(pdLikes.userId, userId)));

    if (existingLike.length > 0) {
      await db
        .delete(pdLikes)
        .where(and(eq(pdLikes.targetPdId, pdId), eq(pdLikes.userId, userId)));
      return null;
    }

    const newPdLike = {
      targetPdId: pdId,
      userId: `${userId}`,
    };

    const [insertedPdLike] = await db
      .insert(pdLikes)
      .values(newPdLike)
      .returning({
        userId: pdLikes.userId,
        pdId: pdLikes.targetPdId,
      });

    return {
      userId: insertedPdLike.userId,
      pdId: insertedPdLike.pdId,
    };
  } catch (error) {
    console.error("PDLikeの操作に失敗しました:", error);
    throw error;
  }
};

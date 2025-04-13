"use server";

import { rePdLikes } from "@/db/schema";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import type { Like } from "../../types";

export const fetchRePdLike = async (rePdId: string): Promise<Like[]> => {
  try {
    const query = db
      .select({
        userId: rePdLikes.userId,
        pdId: rePdLikes.targetRePdId,
      })
      .from(rePdLikes);

    return await query.where(eq(rePdLikes.targetRePdId, rePdId));
  } catch (error) {
    console.error("PDLikeの取得に失敗しました:", error);
    throw error;
  }
};

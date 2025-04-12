"use server";

import { pdLikes } from "@/db/schema";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import type { Like } from "../types";

export const fetchPdLike = async (pdId: string): Promise<Like[]> => {
  try {
    const query = db
      .select({
        userId: pdLikes.userId,
        pdId: pdLikes.targetPdId,
      })
      .from(pdLikes);

    return await query.where(eq(pdLikes.targetPdId, pdId));
  } catch (error) {
    console.error("PDLikeの取得に失敗しました:", error);
    throw error;
  }
};

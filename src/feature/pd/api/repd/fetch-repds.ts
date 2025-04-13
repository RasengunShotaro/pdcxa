"use server";

import { rePds } from "@/db/schema";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import type { RePd } from "../../types";

export const fetchRePds = async (pdId: string): Promise<RePd[]> => {
  try {
    const query = db
      .select({
        id: rePds.id,
        content: rePds.content,
        createdAt: rePds.createdAt,
        userId: rePds.userId,
        pdId: rePds.pdId,
      })
      .from(rePds);

    return await query.where(eq(rePds.pdId, pdId)).orderBy(rePds.createdAt);
  } catch (error) {
    console.error("PDの取得に失敗しました:", error);
    throw error;
  }
};

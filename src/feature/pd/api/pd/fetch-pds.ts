"use server";

import { pds } from "@/db/schema";
import { db } from "@/lib/db";
import { desc, inArray } from "drizzle-orm";
import type { Pd } from "../../types";

export const fetchPds = async (pdIds?: string[]): Promise<Pd[]> => {
  try {
    const query = db
      .select({
        id: pds.id,
        content: pds.content,
        createdAt: pds.createdAt,
        userId: pds.userId,
      })
      .from(pds);

    if (pdIds && pdIds.length > 0) {
      return await query.where(inArray(pds.id, pdIds));
    }

    return await query.orderBy(desc(pds.createdAt)).limit(500);
  } catch (error) {
    console.error("PDの取得に失敗しました:", error);
    throw error;
  }
};

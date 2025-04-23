"use server";

import { rePdLikes, rePds } from "@/db/schema";
import { db } from "@/lib/db";
import { eq, sql } from "drizzle-orm";
import type { RePd } from "../../types";

export const fetchRePds = async (pdId: string): Promise<RePd[]> => {
  try {
    const likesCountSubquery = db
      .select({
        rePdId: rePdLikes.targetRePdId,
        count: sql<number>`count(*)`.as("like_count"),
      })
      .from(rePdLikes)
      .groupBy(rePdLikes.targetRePdId)
      .as("likes_count");

    const likesDetailsSubquery = db
      .select({
        rePdId: rePdLikes.targetRePdId,
        userIds: sql<string[]>`array_agg(${rePdLikes.userId})`.as("user_ids"),
      })
      .from(rePdLikes)
      .groupBy(rePdLikes.targetRePdId)
      .as("likes_details");

    const query = db
      .select({
        id: rePds.id,
        content: rePds.content,
        createdAt: rePds.createdAt,
        userId: rePds.userId,
        pdId: rePds.pdId,
        likeCount: likesCountSubquery.count,
        likes: likesDetailsSubquery.userIds,
      })
      .from(rePds)
      .leftJoin(likesCountSubquery, eq(rePds.id, likesCountSubquery.rePdId))
      .leftJoin(
        likesDetailsSubquery,
        eq(rePds.id, likesDetailsSubquery.rePdId)
      );

    type QueryResult = Awaited<typeof query>;

    const formatRePdRows = (rows: QueryResult) =>
      rows.map((row) => ({
        ...row,
        likeCount: row.likeCount ?? 0,
        likes: (row.likes ?? []).map((userId: string) => ({ userId })),
      }));

    return formatRePdRows(
      await query.where(eq(rePds.pdId, pdId)).orderBy(rePds.createdAt)
    );
  } catch (error) {
    console.error("RePDの取得に失敗しました:", error);
    throw error;
  }
};

"use server";

import { pdLikes, pds, rePds } from "@/db/schema";
import { db } from "@/lib/db";
import { desc, eq, sql } from "drizzle-orm";
import type { Pd } from "../../types";

export const fetchPds = async (pdIds?: string[]): Promise<Pd[]> => {
  try {
    const likesCountSubquery = db
      .select({
        pdId: pdLikes.targetPdId,
        count: sql<number>`count(*)`.as("like_count"),
      })
      .from(pdLikes)
      .groupBy(pdLikes.targetPdId)
      .as("likes_count");

    const repliesCountSubquery = db
      .select({
        pdId: rePds.pdId,
        count: sql<number>`count(*)`.as("reply_count"),
      })
      .from(rePds)
      .groupBy(rePds.pdId)
      .as("replies_count");

    const likesDetailsSubquery = db
      .select({
        pdId: pdLikes.targetPdId,
        userIds: sql<string[]>`array_agg(${pdLikes.userId})`.as("user_ids"),
      })
      .from(pdLikes)
      .groupBy(pdLikes.targetPdId)
      .as("likes_details");

    const query = db
      .select({
        id: pds.id,
        content: pds.content,
        createdAt: pds.createdAt,
        userId: pds.userId,
        likeCount: likesCountSubquery.count,
        replyCount: repliesCountSubquery.count,
        likes: likesDetailsSubquery.userIds,
      })
      .from(pds)
      .leftJoin(likesCountSubquery, eq(pds.id, likesCountSubquery.pdId))
      .leftJoin(repliesCountSubquery, eq(pds.id, repliesCountSubquery.pdId))
      .leftJoin(likesDetailsSubquery, eq(pds.id, likesDetailsSubquery.pdId));

    if (pdIds && pdIds.length > 0) {
      return await query.where(sql`${pds.id} = ANY(${pdIds})`).then((rows) =>
        rows.map((row) => ({
          ...row,
          likeCount: row.likeCount ?? 0,
          replyCount: row.replyCount ?? 0,
          likes: (row.likes ?? []).map((userId) => ({ userId })),
        }))
      );
    }

    return await query
      .orderBy(desc(pds.createdAt))
      .limit(500)
      .then((rows) =>
        rows.map((row) => ({
          ...row,
          likeCount: row.likeCount ?? 0,
          replyCount: row.replyCount ?? 0,
          likes: (row.likes ?? []).map((userId) => ({ userId })),
        }))
      );
  } catch (error) {
    console.error("PDの取得に失敗しました:", error);
    throw error;
  }
};

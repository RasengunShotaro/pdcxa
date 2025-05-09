"use server";

import { pdLikes, pds as pdsSchema, rePds } from "@/db/schema";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { desc, eq, sql } from "drizzle-orm";
import type { Pd } from "../../types";

export const fetchPds = async ({
  pdId,
  userId,
}: {
  pdId?: string;
  userId?: string;
}): Promise<Pd[]> => {
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
      id: pdsSchema.id,
      content: pdsSchema.content,
      createdAt: pdsSchema.createdAt,
      userId: pdsSchema.userId,
      likeCount: likesCountSubquery.count,
      replyCount: repliesCountSubquery.count,
      likes: likesDetailsSubquery.userIds,
    })
    .from(pdsSchema)
    .leftJoin(likesCountSubquery, eq(pdsSchema.id, likesCountSubquery.pdId))
    .leftJoin(repliesCountSubquery, eq(pdsSchema.id, repliesCountSubquery.pdId))
    .leftJoin(
      likesDetailsSubquery,
      eq(pdsSchema.id, likesDetailsSubquery.pdId)
    );

  type QueryResult = Awaited<typeof query>;

  const formatPdRows = (rows: QueryResult) =>
    rows.map((row) => ({
      ...row,
      likeCount: row.likeCount ?? 0,
      replyCount: row.replyCount ?? 0,
      likes: (row.likes ?? []).map((userId: string) => ({ userId })),
    }));

  const fetchSpecificPd = async (pdId: string) => {
    return formatPdRows(await query.where(eq(pdsSchema.id, pdId)));
  };

  const fetchLatestPds = async (userId?: string) => {
    const baseQuery = userId
      ? query.where(eq(pdsSchema.userId, userId))
      : query;

    return formatPdRows(
      await baseQuery.orderBy(desc(pdsSchema.createdAt)).limit(500)
    );
  };

  const fetchedPds = pdId
    ? await fetchSpecificPd(pdId)
    : await fetchLatestPds(userId);

  const currentUserId = (await currentUser())?.id;
  const pds = fetchedPds.map((fetchedPd) => ({
    ...fetchedPd,
    isMyPd: fetchedPd.userId === currentUserId,
  }));

  return pds;
};

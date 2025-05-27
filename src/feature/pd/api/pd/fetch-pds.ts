"use server";

import { pdLikes, pds as pdsSchema, rePds } from "@/db/schema";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { and, desc, eq, sql } from "drizzle-orm";
import type { Pd } from "../../types";

const PAGE_SIZE = 20;

export type PdsResponse = {
  items: Pd[];
  nextCursor?: string;
};

export const fetchPds = async ({
  pdId,
  userId,
  cursor,
}: {
  pdId?: string;
  userId?: string;
  cursor?: string;
}): Promise<PdsResponse> => {
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

  const baseQuery = db
    .select({
      id: pdsSchema.id,
      content: pdsSchema.content,
      createdAt: pdsSchema.createdAt,
      userId: pdsSchema.userId,
      imageUrl: pdsSchema.imageUrl,
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

  type QueryResult = Awaited<typeof baseQuery>;

  const formatPdRows = (rows: QueryResult) =>
    rows.map((row) => ({
      ...row,
      likeCount: row.likeCount ?? 0,
      replyCount: row.replyCount ?? 0,
      likes: (row.likes ?? []).map((userId: string) => ({ userId })),
    }));

  const fetchSpecificPd = async (pdId: string) => {
    const results = formatPdRows(await baseQuery.where(eq(pdsSchema.id, pdId)));
    return {
      items: results,
      nextCursor: undefined,
    };
  };

  const fetchLatestPds = async ({
    userId,
    cursor,
  }: {
    userId?: string;
    cursor?: string;
  }) => {
    const conditions = [
      ...(userId ? [eq(pdsSchema.userId, userId)] : []),
      ...(cursor
        ? [
            sql`${pdsSchema.createdAt} < (SELECT created_at FROM pds WHERE id = ${cursor})`,
          ]
        : []),
    ];

    const query =
      conditions.length > 0 ? baseQuery.where(and(...conditions)) : baseQuery;

    const results = await query
      .orderBy(desc(pdsSchema.createdAt))
      .limit(PAGE_SIZE + 1);

    const hasNextPage = results.length > PAGE_SIZE;
    const items = results.slice(0, PAGE_SIZE);
    const formattedItems = formatPdRows(items);

    return {
      items: formattedItems,
      nextCursor: hasNextPage ? items[items.length - 1].id : undefined,
    };
  };

  const fetchedPds = pdId
    ? await fetchSpecificPd(pdId)
    : await fetchLatestPds({ userId, cursor });

  const currentUserId = (await currentUser())?.id;
  const pds: PdsResponse = {
    ...fetchedPds,
    items: fetchedPds.items.map((fetchedPd) => ({
      ...fetchedPd,
      isMyPd: fetchedPd.userId === currentUserId,
    })),
  };
  return pds;
};

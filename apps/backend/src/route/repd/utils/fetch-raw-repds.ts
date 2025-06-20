import { eq, sql } from "drizzle-orm";
import type { Context } from "hono";
import { rePdLikes, rePds as rePdsSchema } from "../../../db/schema";
import { db } from "../../../lib/db";
import { ログイン中のユーザーを取得 } from "../../../utils/current-user";

export const fetchRawRePds = async ({
  pdId,
  c,
}: {
  pdId: string;
  c: Context;
}) => {
  const userId = ログイン中のユーザーを取得(c).userId;

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
      id: rePdsSchema.id,
      content: rePdsSchema.content,
      createdAt: rePdsSchema.createdAt,
      userId: rePdsSchema.userId,
      pdId: rePdsSchema.pdId,
      likeCount: likesCountSubquery.count,
      likes: likesDetailsSubquery.userIds,
    })
    .from(rePdsSchema)
    .leftJoin(likesCountSubquery, eq(rePdsSchema.id, likesCountSubquery.rePdId))
    .leftJoin(
      likesDetailsSubquery,
      eq(rePdsSchema.id, likesDetailsSubquery.rePdId)
    );

  type QueryResult = Awaited<typeof query>;

  const formatRePdRows = (rows: QueryResult) =>
    rows.map((row) => ({
      ...row,
      likeCount: row.likeCount ?? 0,
      likes: (row.likes ?? []).map((userId: string) => ({ userId })),
    }));

  const fetchedRePds = formatRePdRows(
    await query.where(eq(rePdsSchema.pdId, pdId)).orderBy(rePdsSchema.createdAt)
  );

  const currentUserId = userId;
  const rePds = fetchedRePds.map((rePd) => ({
    ...rePd,
    isMyRePd: rePd.userId === currentUserId,
  }));

  return rePds;
};

import { and, desc, eq, gte, lte, sql } from "drizzle-orm";
import { Effect, Layer } from "effect";
import { pdLikes, pds as pdsSchema, rePds } from "#/db/schema";
import { PdRepository } from "#/domain/pd/repository";
import type { RawPd } from "#/domain/pd/types";
import { toDatabaseError } from "../error-mapping";
import { DbClient } from "./client";

const PAGE_SIZE = 20;

export const PdRepositoryLive = Layer.effect(
  PdRepository,
  Effect.gen(function* () {
    const db = yield* DbClient;

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
        imageFileName: pdsSchema.imageFileName,
        likeCount: likesCountSubquery.count,
        replyCount: repliesCountSubquery.count,
        likes: likesDetailsSubquery.userIds,
      })
      .from(pdsSchema)
      .leftJoin(likesCountSubquery, eq(pdsSchema.id, likesCountSubquery.pdId))
      .leftJoin(
        repliesCountSubquery,
        eq(pdsSchema.id, repliesCountSubquery.pdId),
      )
      .leftJoin(
        likesDetailsSubquery,
        eq(pdsSchema.id, likesDetailsSubquery.pdId),
      );

    type QueryRow = Awaited<typeof baseQuery>[number];

    const formatRows = (rows: readonly QueryRow[]): RawPd[] =>
      rows.map((row) => ({
        id: row.id,
        content: row.content,
        createdAt: row.createdAt,
        userId: row.userId,
        imageFileName: row.imageFileName,
        likeCount: Number(row.likeCount ?? 0),
        replyCount: Number(row.replyCount ?? 0),
        likes: (row.likes ?? []).map((userId) => ({ userId })),
      }));

    const 期間条件 = (range: { start: Date; end: Date }) =>
      and(
        gte(pdsSchema.createdAt, range.start),
        lte(pdsSchema.createdAt, range.end),
      );

    return PdRepository.of({
      一覧を取得する: ({ userId, cursor }) =>
        Effect.tryPromise({
          try: async () => {
            const conditions = [
              ...(userId ? [eq(pdsSchema.userId, userId)] : []),
              ...(cursor
                ? [
                    sql`(${pdsSchema.createdAt}, ${pdsSchema.id}) < (SELECT created_at, id FROM pds WHERE id = ${cursor})`,
                  ]
                : []),
            ];

            const query =
              conditions.length > 0
                ? baseQuery.where(and(...conditions))
                : baseQuery;

            const results = await query
              .orderBy(desc(pdsSchema.createdAt), desc(pdsSchema.id))
              .limit(PAGE_SIZE + 1);

            const hasNextPage = results.length > PAGE_SIZE;
            const items = formatRows(results.slice(0, PAGE_SIZE));

            return {
              items,
              nextCursor: hasNextPage ? items[items.length - 1]?.id : undefined,
            };
          },
          catch: toDatabaseError,
        }),

      IDで取得する: (pdId) =>
        Effect.tryPromise({
          try: async () =>
            formatRows(await baseQuery.where(eq(pdsSchema.id, pdId))),
          catch: toDatabaseError,
        }),

      作成する: (newPd) =>
        Effect.tryPromise({
          try: () => db.insert(pdsSchema).values(newPd),
          catch: toDatabaseError,
        }).pipe(Effect.asVoid),

      いいねをトグルする: ({ pdId, userId }) =>
        Effect.tryPromise({
          try: async () => {
            const existingLike = await db
              .select()
              .from(pdLikes)
              .where(
                and(eq(pdLikes.userId, userId), eq(pdLikes.targetPdId, pdId)),
              )
              .limit(1);

            if (existingLike.length > 0) {
              await db
                .delete(pdLikes)
                .where(
                  and(eq(pdLikes.userId, userId), eq(pdLikes.targetPdId, pdId)),
                );
              return;
            }

            await db.insert(pdLikes).values({ userId, targetPdId: pdId });
          },
          catch: toDatabaseError,
        }).pipe(Effect.asVoid),

      日毎の集計を取得する: (range) =>
        Effect.tryPromise({
          try: async () => {
            const PD日付 = sql<string>`date_trunc('day', (${pdsSchema.createdAt} AT TIME ZONE 'UTC') AT TIME ZONE 'Asia/Tokyo')`;
            const RePD日付 = sql<string>`date_trunc('day', (${rePds.createdAt} AT TIME ZONE 'UTC') AT TIME ZONE 'Asia/Tokyo')`;
            const repd期間条件 = and(
              gte(rePds.createdAt, range.start),
              lte(rePds.createdAt, range.end),
            );

            const [日毎のPD数, 日毎のRePD数, 日毎のいいね数] =
              await Promise.all([
                db
                  .select({ 集計日: PD日付, count: sql<number>`count(*)` })
                  .from(pdsSchema)
                  .where(期間条件(range))
                  .groupBy(PD日付),
                db
                  .select({ 集計日: RePD日付, count: sql<number>`count(*)` })
                  .from(rePds)
                  .where(repd期間条件)
                  .groupBy(RePD日付),
                db
                  .select({
                    集計日: PD日付,
                    count: sql<number>`count(${pdLikes.userId})`,
                  })
                  .from(pdLikes)
                  .innerJoin(pdsSchema, eq(pdLikes.targetPdId, pdsSchema.id))
                  .where(期間条件(range))
                  .groupBy(PD日付),
              ]);

            return { 日毎のPD数, 日毎のRePD数, 日毎のいいね数 };
          },
          catch: toDatabaseError,
        }),

      投稿者別集計を取得する: (range) =>
        Effect.tryPromise({
          try: async () => {
            const repd期間条件 = and(
              gte(rePds.createdAt, range.start),
              lte(rePds.createdAt, range.end),
            );

            const [
              ユーザーごとのPD数,
              ユーザーごとのいいね数,
              ユーザーごとのRePD数,
            ] = await Promise.all([
              db
                .select({
                  userId: pdsSchema.userId,
                  value: sql<number>`count(*)`,
                })
                .from(pdsSchema)
                .where(期間条件(range))
                .groupBy(pdsSchema.userId),
              db
                .select({
                  userId: pdLikes.userId,
                  value: sql<number>`count(*)`,
                })
                .from(pdLikes)
                .innerJoin(pdsSchema, eq(pdLikes.targetPdId, pdsSchema.id))
                .where(期間条件(range))
                .groupBy(pdLikes.userId),
              db
                .select({ userId: rePds.userId, value: sql<number>`count(*)` })
                .from(rePds)
                .where(repd期間条件)
                .groupBy(rePds.userId),
            ]);

            return {
              ユーザーごとのPD数,
              ユーザーごとのいいね数,
              ユーザーごとのRePD数,
            };
          },
          catch: toDatabaseError,
        }),
    });
  }),
);

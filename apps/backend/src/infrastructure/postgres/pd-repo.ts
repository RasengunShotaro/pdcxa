import { and, desc, eq, gte, inArray, lte, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { Effect, Layer } from "effect";
import { pdBookmarks, pdLikes, pds as pdsSchema, rePds } from "#/db/schema";
import { PdRepository } from "#/domain/pd/repository";
import type { RawPd } from "#/domain/pd/types";
import { toDatabaseError } from "../error-mapping";
import {
  保存一覧の続き位置を作る,
  保存一覧の続き位置を読む,
} from "./bookmark-cursor";
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

    const quotesCountSubquery = db
      .select({
        pdId: pdsSchema.quotedPdId,
        count: sql<number>`count(*)`.as("quote_count"),
      })
      .from(pdsSchema)
      .groupBy(pdsSchema.quotedPdId)
      .as("quotes_count");

    const quotedPds = alias(pdsSchema, "quoted_pds");

    const createBaseQuery = () =>
      db
        .select({
          id: pdsSchema.id,
          content: pdsSchema.content,
          createdAt: pdsSchema.createdAt,
          userId: pdsSchema.userId,
          imageFileName: pdsSchema.imageFileName,
          likeCount: likesCountSubquery.count,
          replyCount: repliesCountSubquery.count,
          likes: likesDetailsSubquery.userIds,
          quoteCount: quotesCountSubquery.count,
          quotedPdId: quotedPds.id,
          quotedPdContent: quotedPds.content,
          quotedPdCreatedAt: quotedPds.createdAt,
          quotedPdUserId: quotedPds.userId,
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
        )
        .leftJoin(
          quotesCountSubquery,
          eq(pdsSchema.id, quotesCountSubquery.pdId),
        )
        .leftJoin(quotedPds, eq(pdsSchema.quotedPdId, quotedPds.id));

    type QueryRow = Awaited<ReturnType<typeof createBaseQuery>>[number];

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
        quoteCount: Number(row.quoteCount ?? 0),
        quotedPd:
          row.quotedPdId &&
          row.quotedPdContent !== null &&
          row.quotedPdCreatedAt &&
          row.quotedPdUserId
            ? {
                id: row.quotedPdId,
                content: row.quotedPdContent,
                createdAt: row.quotedPdCreatedAt,
                userId: row.quotedPdUserId,
              }
            : null,
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
                ? createBaseQuery().where(and(...conditions))
                : createBaseQuery();

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
            formatRows(await createBaseQuery().where(eq(pdsSchema.id, pdId))),
          catch: toDatabaseError,
        }),

      作成する: (newPd) =>
        Effect.tryPromise({
          try: async () => {
            const [inserted] = await db
              .insert(pdsSchema)
              .values(newPd)
              .returning({ id: pdsSchema.id });
            const [created] = formatRows(
              await createBaseQuery().where(eq(pdsSchema.id, inserted.id)),
            );
            return created;
          },
          catch: toDatabaseError,
        }),

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

      ブックマーク状態を設定する: ({ pdId, userId, bookmarked }) =>
        Effect.tryPromise({
          try: async () => {
            if (bookmarked) {
              await db
                .insert(pdBookmarks)
                .values({ targetPdId: pdId, userId })
                .onConflictDoNothing();
              return;
            }
            await db
              .delete(pdBookmarks)
              .where(
                and(
                  eq(pdBookmarks.targetPdId, pdId),
                  eq(pdBookmarks.userId, userId),
                ),
              );
          },
          catch: toDatabaseError,
        }),

      ブックマーク済みのPDIDを絞り込む: ({ userId, pdIds }) =>
        pdIds.length === 0
          ? Effect.succeed([])
          : Effect.tryPromise({
              try: async () => {
                const rows = await db
                  .select({ pdId: pdBookmarks.targetPdId })
                  .from(pdBookmarks)
                  .where(
                    and(
                      eq(pdBookmarks.userId, userId),
                      inArray(pdBookmarks.targetPdId, [...pdIds]),
                    ),
                  );
                return rows.map((row) => row.pdId);
              },
              catch: toDatabaseError,
            }),

      ブックマークしたPD一覧を取得する: ({ userId, cursor }) =>
        Effect.tryPromise({
          try: async () => {
            const 続き位置 = 保存一覧の続き位置を読む(cursor);
            const conditions = 続き位置
              ? [
                  sql`(${pdBookmarks.createdAt}, ${pdBookmarks.targetPdId}) < (${続き位置.savedAt}::timestamp, ${続き位置.pdId}::uuid)`,
                ]
              : [];

            const bookmarks = await db
              .select({
                pdId: pdBookmarks.targetPdId,
                savedAt: sql<string>`${pdBookmarks.createdAt}::text`,
              })
              .from(pdBookmarks)
              .where(and(eq(pdBookmarks.userId, userId), ...conditions))
              .orderBy(
                desc(pdBookmarks.createdAt),
                desc(pdBookmarks.targetPdId),
              )
              .limit(PAGE_SIZE + 1);

            const page = bookmarks.slice(0, PAGE_SIZE);
            const lastBookmark = page[page.length - 1];
            const rows =
              page.length === 0
                ? []
                : await createBaseQuery().where(
                    inArray(
                      pdsSchema.id,
                      page.map((bookmark) => bookmark.pdId),
                    ),
                  );
            const rowById = new Map(rows.map((row) => [row.id, row]));
            const orderedRows = page.flatMap((bookmark) => {
              const row = rowById.get(bookmark.pdId);
              return row ? [row] : [];
            });

            return {
              items: formatRows(orderedRows),
              nextCursor:
                bookmarks.length > PAGE_SIZE && lastBookmark
                  ? 保存一覧の続き位置を作る(lastBookmark)
                  : undefined,
            };
          },
          catch: toDatabaseError,
        }),

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

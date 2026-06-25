import {
  and,
  desc,
  eq,
  gt,
  lt,
  ne,
  or,
  type SQLWrapper,
  sql,
} from "drizzle-orm";
import { unionAll } from "drizzle-orm/pg-core";
import { Effect, Layer } from "effect";
import {
  notificationSeen,
  pdLikes,
  pds as pdsSchema,
  rePdLikes,
  rePds as rePdsSchema,
} from "#/db/schema";
import { 抜粋にする } from "#/domain/notification/excerpt";
import { NotificationRepository } from "#/domain/notification/repository";
import type {
  NotificationKind,
  RawNotification,
} from "#/domain/notification/types";
import { toDatabaseError } from "../error-mapping";
import { DbClient } from "./client";

const PAGE_SIZE = 20;

type ParsedCursor = {
  readonly createdAt: Date;
  readonly sortKey: string;
};

const CURSOR_SEPARATOR = "|";

const parseCursor = (cursor?: string): ParsedCursor | undefined => {
  if (!cursor) {
    return undefined;
  }
  const separatorIndex = cursor.indexOf(CURSOR_SEPARATOR);
  if (separatorIndex === -1) {
    return undefined;
  }
  return {
    createdAt: new Date(cursor.slice(0, separatorIndex)),
    sortKey: cursor.slice(separatorIndex + 1),
  };
};

export const NotificationRepositoryLive = Layer.effect(
  NotificationRepository,
  Effect.gen(function* () {
    const db = yield* DbClient;

    const pdLikeSortKey = sql<string>`'pdLike:' || ${pdsSchema.id}::text || ':' || ${pdLikes.userId}`;
    const rePdLikeSortKey = sql<string>`'rePdLike:' || ${rePdsSchema.id}::text || ':' || ${rePdLikes.userId}`;
    const rePdSortKey = sql<string>`'rePd:' || ${rePdsSchema.id}::text || ':' || ${rePdsSchema.userId}`;

    const カーソル条件 = (
      createdAtColumn: SQLWrapper,
      sortKeyExpr: SQLWrapper,
      cursor: ParsedCursor | undefined,
    ) => {
      if (!cursor) {
        return undefined;
      }
      return or(
        lt(createdAtColumn, cursor.createdAt),
        and(
          eq(createdAtColumn, cursor.createdAt),
          sql`${sortKeyExpr} < ${cursor.sortKey}`,
        ),
      );
    };

    const 反応ブランチ = (userId: string, cursor?: string) => {
      const parsed = parseCursor(cursor);

      const pdLike = db
        .select({
          kind: sql<NotificationKind>`'pdLike'`.as("kind"),
          actorUserId: pdLikes.userId,
          pdId: pdsSchema.id,
          rePdId: sql<string | null>`null`.as("repd_id"),
          excerpt: pdsSchema.content,
          createdAt: pdLikes.createdAt,
          sortKey: pdLikeSortKey.as("sort_key"),
        })
        .from(pdLikes)
        .innerJoin(pdsSchema, eq(pdsSchema.id, pdLikes.targetPdId))
        .where(
          and(
            eq(pdsSchema.userId, userId),
            ne(pdLikes.userId, userId),
            カーソル条件(pdLikes.createdAt, pdLikeSortKey, parsed),
          ),
        );

      const rePdLike = db
        .select({
          kind: sql<NotificationKind>`'rePdLike'`.as("kind"),
          actorUserId: rePdLikes.userId,
          pdId: rePdsSchema.pdId,
          rePdId: rePdsSchema.id,
          excerpt: rePdsSchema.content,
          createdAt: rePdLikes.createdAt,
          sortKey: rePdLikeSortKey.as("sort_key"),
        })
        .from(rePdLikes)
        .innerJoin(rePdsSchema, eq(rePdsSchema.id, rePdLikes.targetRePdId))
        .where(
          and(
            eq(rePdsSchema.userId, userId),
            ne(rePdLikes.userId, userId),
            カーソル条件(rePdLikes.createdAt, rePdLikeSortKey, parsed),
          ),
        );

      const rePd = db
        .select({
          kind: sql<NotificationKind>`'rePd'`.as("kind"),
          actorUserId: rePdsSchema.userId,
          pdId: rePdsSchema.pdId,
          rePdId: rePdsSchema.id,
          excerpt: rePdsSchema.content,
          createdAt: rePdsSchema.createdAt,
          sortKey: rePdSortKey.as("sort_key"),
        })
        .from(rePdsSchema)
        .innerJoin(pdsSchema, eq(pdsSchema.id, rePdsSchema.pdId))
        .where(
          and(
            eq(pdsSchema.userId, userId),
            ne(rePdsSchema.userId, userId),
            カーソル条件(rePdsSchema.createdAt, rePdSortKey, parsed),
          ),
        );

      return { pdLike, rePdLike, rePd };
    };

    return NotificationRepository.of({
      既読時刻を取得する: (userId) =>
        Effect.tryPromise({
          try: async () => {
            const rows = await db
              .select()
              .from(notificationSeen)
              .where(eq(notificationSeen.userId, userId))
              .limit(1);
            return rows[0]?.lastSeenAt ?? null;
          },
          catch: toDatabaseError,
        }),

      未読件数を取得する: ({ userId, lastSeenAt }) =>
        Effect.tryPromise({
          try: async () => {
            const [pdLikeCount, rePdLikeCount, rePdCount] = await Promise.all([
              db
                .select({ value: sql<number>`count(*)` })
                .from(pdLikes)
                .innerJoin(pdsSchema, eq(pdsSchema.id, pdLikes.targetPdId))
                .where(
                  and(
                    eq(pdsSchema.userId, userId),
                    ne(pdLikes.userId, userId),
                    gt(pdLikes.createdAt, lastSeenAt),
                  ),
                ),
              db
                .select({ value: sql<number>`count(*)` })
                .from(rePdLikes)
                .innerJoin(
                  rePdsSchema,
                  eq(rePdsSchema.id, rePdLikes.targetRePdId),
                )
                .where(
                  and(
                    eq(rePdsSchema.userId, userId),
                    ne(rePdLikes.userId, userId),
                    gt(rePdLikes.createdAt, lastSeenAt),
                  ),
                ),
              db
                .select({ value: sql<number>`count(*)` })
                .from(rePdsSchema)
                .innerJoin(pdsSchema, eq(pdsSchema.id, rePdsSchema.pdId))
                .where(
                  and(
                    eq(pdsSchema.userId, userId),
                    ne(rePdsSchema.userId, userId),
                    gt(rePdsSchema.createdAt, lastSeenAt),
                  ),
                ),
            ]);

            return (
              Number(pdLikeCount[0]?.value ?? 0) +
              Number(rePdLikeCount[0]?.value ?? 0) +
              Number(rePdCount[0]?.value ?? 0)
            );
          },
          catch: toDatabaseError,
        }),

      一覧を取得する: ({ userId, cursor }) =>
        Effect.tryPromise({
          try: async () => {
            const { pdLike, rePdLike, rePd } = 反応ブランチ(userId, cursor);

            const 通知 = unionAll(pdLike, rePdLike, rePd).as("notifications");
            const rows = await db
              .select()
              .from(通知)
              .orderBy(desc(通知.createdAt), desc(通知.sortKey))
              .limit(PAGE_SIZE + 1);

            const hasNextPage = rows.length > PAGE_SIZE;
            const pageRows = rows.slice(0, PAGE_SIZE);
            const items: RawNotification[] = pageRows.map((row) => ({
              kind: row.kind,
              actorUserId: row.actorUserId,
              pdId: row.pdId,
              rePdId: row.rePdId,
              excerpt: 抜粋にする(row.excerpt),
              createdAt: row.createdAt,
            }));

            const lastRow = pageRows[pageRows.length - 1];
            return {
              items,
              nextCursor:
                hasNextPage && lastRow
                  ? `${lastRow.createdAt.toISOString()}${CURSOR_SEPARATOR}${lastRow.sortKey}`
                  : undefined,
            };
          },
          catch: toDatabaseError,
        }),

      既読にする: ({ userId, seenAt }) =>
        Effect.tryPromise({
          try: () =>
            db
              .insert(notificationSeen)
              .values({ userId, lastSeenAt: seenAt })
              .onConflictDoUpdate({
                target: notificationSeen.userId,
                set: { lastSeenAt: seenAt },
              }),
          catch: toDatabaseError,
        }).pipe(Effect.asVoid),
    });
  }),
);

import { and, eq, sql } from "drizzle-orm";
import { Effect, Layer } from "effect";
import { rePdLikes, rePds as rePdsSchema } from "#/db/schema";
import { RePdRepository } from "#/domain/repd/repository";
import type { RawRePd } from "#/domain/repd/types";
import { toDatabaseError } from "../error-mapping";
import { DbClient } from "./client";

export const RePdRepositoryLive = Layer.effect(
  RePdRepository,
  Effect.gen(function* () {
    const db = yield* DbClient;

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

    const createBaseQuery = () =>
      db
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
        .leftJoin(
          likesCountSubquery,
          eq(rePdsSchema.id, likesCountSubquery.rePdId),
        )
        .leftJoin(
          likesDetailsSubquery,
          eq(rePdsSchema.id, likesDetailsSubquery.rePdId),
        );

    type QueryRow = Awaited<ReturnType<typeof createBaseQuery>>[number];

    const formatRows = (rows: readonly QueryRow[]): RawRePd[] =>
      rows.map((row) => ({
        id: row.id,
        content: row.content,
        createdAt: row.createdAt,
        userId: row.userId,
        pdId: row.pdId,
        likeCount: Number(row.likeCount ?? 0),
        likes: (row.likes ?? []).map((userId) => ({ userId })),
      }));

    return RePdRepository.of({
      PD配下を取得する: (pdId) =>
        Effect.tryPromise({
          try: async () =>
            formatRows(
              await createBaseQuery()
                .where(eq(rePdsSchema.pdId, pdId))
                .orderBy(rePdsSchema.createdAt),
            ),
          catch: toDatabaseError,
        }),

      作成する: (newRePd) =>
        Effect.tryPromise({
          try: () => db.insert(rePdsSchema).values(newRePd),
          catch: toDatabaseError,
        }).pipe(Effect.asVoid),

      いいねをトグルする: ({ rePdId, userId }) =>
        Effect.tryPromise({
          try: async () => {
            const existingLike = await db
              .select()
              .from(rePdLikes)
              .where(
                and(
                  eq(rePdLikes.targetRePdId, rePdId),
                  eq(rePdLikes.userId, userId),
                ),
              );

            if (existingLike.length > 0) {
              await db
                .delete(rePdLikes)
                .where(
                  and(
                    eq(rePdLikes.targetRePdId, rePdId),
                    eq(rePdLikes.userId, userId),
                  ),
                );
              return;
            }

            await db.insert(rePdLikes).values({ targetRePdId: rePdId, userId });
          },
          catch: toDatabaseError,
        }).pipe(Effect.asVoid),
    });
  }),
);

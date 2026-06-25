import { eq } from "drizzle-orm";
import { Effect, Layer } from "effect";
import { uuidv7 } from "uuidv7";
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from "vitest";
import { pdLikes, pds } from "#/db/schema";
import { PdRepository } from "#/domain/pd/repository";
import type { DbClient as DrizzleDb } from "#/lib/db";
import {
  テストDBをリセットする,
  テストDBを削除する,
  テストDBを起動する,
} from "#/utils/test/setup-db";
import { DbClient } from "./client";
import { PdRepositoryLive } from "./pd-repo";

const レイヤー = (db: DrizzleDb) =>
  PdRepositoryLive.pipe(Layer.provide(Layer.succeed(DbClient, db)));

describe("PdRepositoryLive", () => {
  const ctx = {} as {
    db: DrizzleDb;
    pdId: string;
  };

  beforeAll(async () => {
    ctx.db = await テストDBを起動する();
  });

  beforeEach(async () => {
    await テストDBをリセットする(ctx.db);
    ctx.pdId = uuidv7();
  });

  afterEach(async () => {
    await テストDBをリセットする(ctx.db);
  });

  afterAll(async () => {
    await テストDBを削除する();
  });

  const いいねをトグルする = (pdId: string, userId: string) =>
    Effect.runPromise(
      PdRepository.pipe(
        Effect.flatMap((repo) => repo.いいねをトグルする({ pdId, userId })),
        Effect.provide(レイヤー(ctx.db)),
      ),
    );

  it("いいねが存在しない場合は新規作成する", async () => {
    const userId = "test";
    await ctx.db.insert(pds).values({
      id: ctx.pdId,
      content: "テストPD",
      createdAt: new Date(),
      userId,
    });

    await いいねをトグルする(ctx.pdId, userId);

    const likes = await ctx.db
      .select()
      .from(pdLikes)
      .where(eq(pdLikes.targetPdId, ctx.pdId));
    expect(likes).toHaveLength(1);
    expect(likes[0].userId).toBe(userId);
  });

  it("いいねが既に存在する場合は削除する", async () => {
    const userId = "test";
    await ctx.db.insert(pds).values({
      id: ctx.pdId,
      content: "テストPD",
      createdAt: new Date(),
      userId,
    });
    await ctx.db.insert(pdLikes).values({ targetPdId: ctx.pdId, userId });

    await いいねをトグルする(ctx.pdId, userId);

    const likes = await ctx.db
      .select()
      .from(pdLikes)
      .where(eq(pdLikes.targetPdId, ctx.pdId));
    expect(likes).toHaveLength(0);
  });

  it("対象ユーザーのいいねだけをトグルし他ユーザーのいいねは残す", async () => {
    const userId1 = "test1";
    const userId2 = "test2";
    await ctx.db.insert(pds).values({
      id: ctx.pdId,
      content: "テストPD",
      createdAt: new Date(),
      userId: userId1,
    });
    await ctx.db
      .insert(pdLikes)
      .values({ targetPdId: ctx.pdId, userId: userId1 });
    await ctx.db
      .insert(pdLikes)
      .values({ targetPdId: ctx.pdId, userId: userId2 });

    await いいねをトグルする(ctx.pdId, userId1);

    const likes = await ctx.db
      .select()
      .from(pdLikes)
      .where(eq(pdLikes.targetPdId, ctx.pdId));
    expect(likes).toHaveLength(1);
    expect(likes[0].userId).toBe(userId2);
  });

  const 一覧を取得する = (params: { userId?: string; cursor?: string }) =>
    Effect.runPromise(
      PdRepository.pipe(
        Effect.flatMap((repo) => repo.一覧を取得する(params)),
        Effect.provide(レイヤー(ctx.db)),
      ),
    );

  it("作成時刻が同一の投稿が PAGE_SIZE を超えても全件をページングで取得できる", async () => {
    const author = "author";
    const sameInstant = new Date("2026-06-24T00:00:00.000Z");
    const total = 25;
    const ids = Array.from({ length: total }, () => uuidv7());
    await ctx.db.insert(pds).values(
      ids.map((id, index) => ({
        id,
        content: `同時刻PD ${index}`,
        createdAt: sameInstant,
        userId: author,
      })),
    );

    const collected: string[] = [];
    let cursor: string | undefined;
    for (let page = 0; page < total + 1; page += 1) {
      const result = await 一覧を取得する({ userId: author, cursor });
      collected.push(...result.items.map((item) => item.id));
      if (!result.nextCursor) break;
      cursor = result.nextCursor;
    }

    expect([...new Set(collected)].sort()).toEqual([...ids].sort());
  });

  it("IDで取得すると like 数・likes 配列を集計して返す", async () => {
    const author = "author";
    await ctx.db.insert(pds).values({
      id: ctx.pdId,
      content: "テストPD",
      createdAt: new Date(),
      userId: author,
    });
    await ctx.db
      .insert(pdLikes)
      .values({ targetPdId: ctx.pdId, userId: "fan1" });
    await ctx.db
      .insert(pdLikes)
      .values({ targetPdId: ctx.pdId, userId: "fan2" });

    const result = await Effect.runPromise(
      PdRepository.pipe(
        Effect.flatMap((repo) => repo.IDで取得する(ctx.pdId)),
        Effect.provide(レイヤー(ctx.db)),
      ),
    );

    expect(result).toHaveLength(1);
    expect(result[0].likeCount).toBe(2);
    expect(result[0].likes.map((l) => l.userId).sort()).toEqual([
      "fan1",
      "fan2",
    ]);
  });
});

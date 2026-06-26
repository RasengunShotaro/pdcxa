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
import { pds, rePdLikes, rePds } from "#/db/schema";
import { RePdRepository } from "#/domain/repd/repository";
import type { DbClient as DrizzleDb } from "#/lib/db";
import {
  テストDBをリセットする,
  テストDBを削除する,
  テストDBを起動する,
} from "#/utils/test/setup-db";
import { DbClient } from "./client";
import { RePdRepositoryLive } from "./repd-repo";

const レイヤー = (db: DrizzleDb) =>
  RePdRepositoryLive.pipe(Layer.provide(Layer.succeed(DbClient, db)));

describe("RePdRepositoryLive", () => {
  const ctx = {} as {
    db: DrizzleDb;
    pdId: string;
    rePdId: string;
  };

  beforeAll(async () => {
    ctx.db = await テストDBを起動する();
  });

  beforeEach(async () => {
    await テストDBをリセットする(ctx.db);
    ctx.pdId = uuidv7();
    ctx.rePdId = uuidv7();
    await ctx.db.insert(pds).values({
      id: ctx.pdId,
      content: "親PD",
      createdAt: new Date(),
      userId: "author",
    });
    await ctx.db.insert(rePds).values({
      id: ctx.rePdId,
      pdId: ctx.pdId,
      content: "テストRePD",
      createdAt: new Date(),
      userId: "author",
    });
  });

  afterEach(async () => {
    await テストDBをリセットする(ctx.db);
  });

  afterAll(async () => {
    await テストDBを削除する();
  });

  const いいねをトグルする = (rePdId: string, userId: string) =>
    Effect.runPromise(
      RePdRepository.pipe(
        Effect.flatMap((repo) => repo.いいねをトグルする({ rePdId, userId })),
        Effect.provide(レイヤー(ctx.db)),
      ),
    );

  it("いいねが存在しない場合は新規作成する", async () => {
    await いいねをトグルする(ctx.rePdId, "fan1");

    const likes = await ctx.db
      .select()
      .from(rePdLikes)
      .where(eq(rePdLikes.targetRePdId, ctx.rePdId));
    expect(likes).toHaveLength(1);
    expect(likes[0].userId).toBe("fan1");
  });

  it("いいねが既に存在する場合は削除する", async () => {
    await ctx.db
      .insert(rePdLikes)
      .values({ targetRePdId: ctx.rePdId, userId: "fan1" });

    await いいねをトグルする(ctx.rePdId, "fan1");

    const likes = await ctx.db
      .select()
      .from(rePdLikes)
      .where(eq(rePdLikes.targetRePdId, ctx.rePdId));
    expect(likes).toHaveLength(0);
  });

  it("対象ユーザーのいいねだけをトグルし他ユーザーのいいねは残す", async () => {
    await ctx.db
      .insert(rePdLikes)
      .values({ targetRePdId: ctx.rePdId, userId: "fan1" });
    await ctx.db
      .insert(rePdLikes)
      .values({ targetRePdId: ctx.rePdId, userId: "fan2" });

    await いいねをトグルする(ctx.rePdId, "fan1");

    const likes = await ctx.db
      .select()
      .from(rePdLikes)
      .where(eq(rePdLikes.targetRePdId, ctx.rePdId));
    expect(likes).toHaveLength(1);
    expect(likes[0].userId).toBe("fan2");
  });

  it("PD配下を取得するといいね数といいねユーザー一覧を集計して返す", async () => {
    await ctx.db
      .insert(rePdLikes)
      .values({ targetRePdId: ctx.rePdId, userId: "fan1" });
    await ctx.db
      .insert(rePdLikes)
      .values({ targetRePdId: ctx.rePdId, userId: "fan2" });

    const result = await Effect.runPromise(
      RePdRepository.pipe(
        Effect.flatMap((repo) => repo.PD配下を取得する(ctx.pdId)),
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

  it("並行で別 PD の配下を取得しても各 PD のリプライだけが返る", async () => {
    const 別pdId = uuidv7();
    await ctx.db.insert(pds).values({
      id: 別pdId,
      content: "別の親PD",
      createdAt: new Date(),
      userId: "author",
    });
    await ctx.db.insert(rePds).values({
      id: uuidv7(),
      pdId: 別pdId,
      content: "別PDのRePD",
      createdAt: new Date(),
      userId: "author",
    });

    const [元PDの配下, 別PDの配下] = await Effect.runPromise(
      Effect.gen(function* () {
        const repo = yield* RePdRepository;
        return yield* Effect.all(
          [repo.PD配下を取得する(ctx.pdId), repo.PD配下を取得する(別pdId)],
          { concurrency: "unbounded" },
        );
      }).pipe(Effect.provide(レイヤー(ctx.db))),
    );

    expect(元PDの配下.map((r) => r.pdId)).toEqual([ctx.pdId]);
    expect(別PDの配下.map((r) => r.pdId)).toEqual([別pdId]);
  });
});

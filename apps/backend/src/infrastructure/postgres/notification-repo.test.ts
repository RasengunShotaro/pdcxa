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
import { pdLikes, pds, rePdLikes, rePds } from "#/db/schema";
import { NotificationRepository } from "#/domain/notification/repository";
import type { DbClient as DrizzleDb } from "#/lib/db";
import {
  テストDBをリセットする,
  テストDBを削除する,
  テストDBを起動する,
} from "#/utils/test/setup-db";
import { DbClient } from "./client";
import { NotificationRepositoryLive } from "./notification-repo";

const レイヤー = (db: DrizzleDb) =>
  NotificationRepositoryLive.pipe(Layer.provide(Layer.succeed(DbClient, db)));

const ME = "me";
const OTHER = "other";

const 日時 = (iso: string) => new Date(iso);

describe("NotificationRepositoryLive", () => {
  const ctx = {} as {
    db: DrizzleDb;
    myPdId: string;
    othersPdId: string;
    myRePdId: string;
    othersRePdId: string;
  };

  const 一覧を取得する = (cursor?: string) =>
    Effect.runPromise(
      NotificationRepository.pipe(
        Effect.flatMap((repo) => repo.一覧を取得する({ userId: ME, cursor })),
        Effect.provide(レイヤー(ctx.db)),
      ),
    );

  const 未読件数を取得する = (lastSeenAt: Date) =>
    Effect.runPromise(
      NotificationRepository.pipe(
        Effect.flatMap((repo) =>
          repo.未読件数を取得する({ userId: ME, lastSeenAt }),
        ),
        Effect.provide(レイヤー(ctx.db)),
      ),
    );

  const 既読時刻を取得する = (userId: string) =>
    Effect.runPromise(
      NotificationRepository.pipe(
        Effect.flatMap((repo) => repo.既読時刻を取得する(userId)),
        Effect.provide(レイヤー(ctx.db)),
      ),
    );

  const 既読にする = (seenAt: Date) =>
    Effect.runPromise(
      NotificationRepository.pipe(
        Effect.flatMap((repo) => repo.既読にする({ userId: ME, seenAt })),
        Effect.provide(レイヤー(ctx.db)),
      ),
    );

  beforeAll(async () => {
    ctx.db = await テストDBを起動する();
  });

  beforeEach(async () => {
    await テストDBをリセットする(ctx.db);
    ctx.myPdId = uuidv7();
    ctx.othersPdId = uuidv7();
    ctx.myRePdId = uuidv7();
    ctx.othersRePdId = uuidv7();

    await ctx.db.insert(pds).values([
      {
        id: ctx.myPdId,
        content: "私のPD",
        createdAt: 日時("2026-06-20T00:00:00.000Z"),
        userId: ME,
      },
      {
        id: ctx.othersPdId,
        content: "他人のPD",
        createdAt: 日時("2026-06-20T00:00:00.000Z"),
        userId: OTHER,
      },
    ]);

    await ctx.db.insert(rePds).values([
      {
        id: ctx.myRePdId,
        pdId: ctx.othersPdId,
        content: "私のRePd",
        createdAt: 日時("2026-06-21T00:00:00.000Z"),
        userId: ME,
      },
      {
        id: ctx.othersRePdId,
        pdId: ctx.myPdId,
        content: "他人のRePd",
        createdAt: 日時("2026-06-22T00:00:00.000Z"),
        userId: OTHER,
      },
    ]);
  });

  afterEach(async () => {
    await テストDBをリセットする(ctx.db);
  });

  afterAll(async () => {
    await テストDBを削除する();
  });

  it("自分の投稿への他人の反応(いいね/RePd)を新しい順で拾う", async () => {
    await ctx.db.insert(pdLikes).values({
      targetPdId: ctx.myPdId,
      userId: OTHER,
      createdAt: 日時("2026-06-23T00:00:00.000Z"),
    });
    await ctx.db.insert(rePdLikes).values({
      targetRePdId: ctx.myRePdId,
      userId: OTHER,
      createdAt: 日時("2026-06-24T00:00:00.000Z"),
    });

    const page = await 一覧を取得する();

    expect(page.items.map((item) => item.kind)).toEqual([
      "rePdLike",
      "pdLike",
      "rePd",
    ]);
    expect(page.items.every((item) => item.actorUserId === OTHER)).toBe(true);
    expect(page.nextCursor).toBeUndefined();
  });

  it("他人の投稿への反応は拾わない", async () => {
    await ctx.db.insert(pdLikes).values({
      targetPdId: ctx.othersPdId,
      userId: "stranger",
      createdAt: 日時("2026-06-23T00:00:00.000Z"),
    });

    const page = await 一覧を取得する();

    expect(page.items).toHaveLength(1);
    expect(page.items[0].kind).toBe("rePd");
  });

  it("自分自身の反応(自己いいね/自己RePd)は通知に含めない", async () => {
    await ctx.db.insert(pdLikes).values({
      targetPdId: ctx.myPdId,
      userId: ME,
      createdAt: 日時("2026-06-23T00:00:00.000Z"),
    });

    const page = await 一覧を取得する();

    expect(page.items.every((item) => item.actorUserId !== ME)).toBe(true);
    expect(page.items).toHaveLength(1);
    expect(page.items[0].kind).toBe("rePd");
  });

  it("未読件数は last_seen より後の反応だけ数える", async () => {
    await ctx.db.insert(pdLikes).values({
      targetPdId: ctx.myPdId,
      userId: OTHER,
      createdAt: 日時("2026-06-23T00:00:00.000Z"),
    });

    expect(await 未読件数を取得する(日時("2026-06-22T12:00:00.000Z"))).toBe(1);
    expect(await 未読件数を取得する(日時("2026-06-19T00:00:00.000Z"))).toBe(2);
    expect(await 未読件数を取得する(日時("2026-06-30T00:00:00.000Z"))).toBe(0);
  });

  it("既読時刻は未設定なら null、既読化で upsert される", async () => {
    expect(await 既読時刻を取得する(ME)).toBeNull();

    await 既読にする(日時("2026-06-25T00:00:00.000Z"));
    expect(await 既読時刻を取得する(ME)).toEqual(
      日時("2026-06-25T00:00:00.000Z"),
    );

    await 既読にする(日時("2026-06-26T00:00:00.000Z"));
    expect(await 既読時刻を取得する(ME)).toEqual(
      日時("2026-06-26T00:00:00.000Z"),
    );
  });

  it("同一時刻の反応がページ境界をまたいでも取りこぼさない", async () => {
    const sameTime = 日時("2026-06-23T00:00:00.000Z");
    const likerIds = Array.from(
      { length: 25 },
      (_, index) => `liker-${String(index).padStart(2, "0")}`,
    );
    await ctx.db.insert(pdLikes).values(
      likerIds.map((userId) => ({
        targetPdId: ctx.myPdId,
        userId,
        createdAt: sameTime,
      })),
    );

    const seen = new Set<string>();
    let cursor: string | undefined;
    for (let guard = 0; guard < 10; guard += 1) {
      const page = await 一覧を取得する(cursor);
      for (const item of page.items) {
        seen.add(`${item.kind}:${item.pdId}:${item.actorUserId}`);
      }
      if (!page.nextCursor) {
        break;
      }
      cursor = page.nextCursor;
    }

    const pdLikeActors = [...seen].filter((key) => key.startsWith("pdLike:"));
    expect(pdLikeActors).toHaveLength(25);
  });
});

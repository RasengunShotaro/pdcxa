import { eq, sql } from "drizzle-orm";
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
import { pdBookmarks, pdLikes, pds } from "#/db/schema";
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

  const 作成する = (newPd: {
    content: string;
    userId: string;
    createdAt: Date;
    imageFileName: string | null;
    quotedPdId?: string | null;
  }) =>
    Effect.runPromise(
      PdRepository.pipe(
        Effect.flatMap((repo) =>
          repo.作成する({ ...newPd, quotedPdId: newPd.quotedPdId ?? null }),
        ),
        Effect.provide(レイヤー(ctx.db)),
      ),
    );

  it("作成すると採番された ID 付きで作成した PD を返す", async () => {
    const created = 作成する({
      content: "作成したPD",
      userId: "author",
      createdAt: new Date("2026-06-26T00:00:00.000Z"),
      imageFileName: null,
    });

    const result = await created;

    expect(result).toMatchObject({
      content: "作成したPD",
      userId: "author",
      imageFileName: null,
      likeCount: 0,
      replyCount: 0,
      likes: [],
    });
    expect(result.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    );
  });

  it("作成した PD が一覧取得で先頭に現れる", async () => {
    const created = await 作成する({
      content: "新着PD",
      userId: "author",
      createdAt: new Date("2026-06-26T12:00:00.000Z"),
      imageFileName: null,
    });

    const result = await 一覧を取得する({ userId: "author" });

    expect(result.items[0].id).toBe(created.id);
  });

  const 一覧を取得する = (params: { userId?: string; cursor?: string }) =>
    Effect.runPromise(
      PdRepository.pipe(
        Effect.flatMap((repo) => repo.一覧を取得する(params)),
        Effect.provide(レイヤー(ctx.db)),
      ),
    );

  it("カーソル付き取得の直後に同じリポジトリでカーソル無し取得しても最新が先頭に来る", async () => {
    const author = "author";
    const base = new Date("2026-06-26T00:00:00.000Z");
    const ids = Array.from({ length: 5 }, () => uuidv7());
    await ctx.db.insert(pds).values(
      ids.map((id, index) => ({
        id,
        content: `PD ${index}`,
        createdAt: new Date(base.getTime() + index * 1000),
        userId: author,
      })),
    );
    const newestId = ids[4];
    const middleId = ids[2];

    const result = await Effect.runPromise(
      Effect.gen(function* () {
        const repo = yield* PdRepository;
        yield* repo.一覧を取得する({ cursor: middleId });
        return yield* repo.一覧を取得する({});
      }).pipe(Effect.provide(レイヤー(ctx.db))),
    );

    expect(result.items[0]?.id).toBe(newestId);
  });

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

    expect([...collected].sort()).toEqual([...ids].sort());
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

  it("引用して作成した PD は引用元の本文と投稿者を持って返る", async () => {
    await ctx.db.insert(pds).values({
      id: ctx.pdId,
      content: "引用元の本文",
      createdAt: new Date("2026-03-12T00:00:00.000Z"),
      userId: "original-author",
    });

    const created = await 作成する({
      content: "今は逆の意見",
      userId: "quoter",
      createdAt: new Date("2026-06-26T00:00:00.000Z"),
      imageFileName: null,
      quotedPdId: ctx.pdId,
    });

    expect(created.quotedPd).toMatchObject({
      id: ctx.pdId,
      content: "引用元の本文",
      userId: "original-author",
    });
  });

  it("引用せずに作成した PD は引用元を持たない", async () => {
    const created = await 作成する({
      content: "ふつうの PD",
      userId: "author",
      createdAt: new Date("2026-06-26T00:00:00.000Z"),
      imageFileName: null,
      quotedPdId: null,
    });

    expect(created.quotedPd).toBeNull();
  });

  it("引用された PD は引用された回数を持つ", async () => {
    await ctx.db.insert(pds).values({
      id: ctx.pdId,
      content: "引用元",
      createdAt: new Date("2026-03-12T00:00:00.000Z"),
      userId: "original-author",
    });
    await 作成する({
      content: "引用 1",
      userId: "a",
      createdAt: new Date("2026-06-26T00:00:00.000Z"),
      imageFileName: null,
      quotedPdId: ctx.pdId,
    });
    await 作成する({
      content: "引用 2",
      userId: "b",
      createdAt: new Date("2026-06-27T00:00:00.000Z"),
      imageFileName: null,
      quotedPdId: ctx.pdId,
    });

    const [original] = await Effect.runPromise(
      PdRepository.pipe(
        Effect.flatMap((repo) => repo.IDで取得する(ctx.pdId)),
        Effect.provide(レイヤー(ctx.db)),
      ),
    );

    expect(original.quoteCount).toBe(2);
  });

  const PDを用意する = async (count: number) => {
    const ids = Array.from({ length: count }, () => uuidv7());
    const base = new Date("2026-06-26T00:00:00.000Z");
    await ctx.db.insert(pds).values(
      ids.map((id, index) => ({
        id,
        content: `PD ${index}`,
        createdAt: new Date(base.getTime() + index * 1000),
        userId: "author",
      })),
    );
    return ids;
  };

  const ブックマーク状態を設定する = (params: {
    pdId: string;
    userId: string;
    bookmarked: boolean;
  }) =>
    Effect.runPromise(
      PdRepository.pipe(
        Effect.flatMap((repo) => repo.ブックマーク状態を設定する(params)),
        Effect.provide(レイヤー(ctx.db)),
      ),
    );

  const ブックマークしたPD一覧を取得する = (params: {
    userId: string;
    cursor?: string;
  }) =>
    Effect.runPromise(
      PdRepository.pipe(
        Effect.flatMap((repo) => repo.ブックマークしたPD一覧を取得する(params)),
        Effect.provide(レイヤー(ctx.db)),
      ),
    );

  it("ブックマークした PD が保存した PD の一覧に現れる", async () => {
    const [pdId] = await PDを用意する(1);

    await ブックマーク状態を設定する({ pdId, userId: "me", bookmarked: true });

    const result = await ブックマークしたPD一覧を取得する({ userId: "me" });
    expect(result.items.map((item) => item.id)).toEqual([pdId]);
  });

  it("同じ PD を二度ブックマークしても一覧には一件だけ現れる", async () => {
    const [pdId] = await PDを用意する(1);
    await ブックマーク状態を設定する({ pdId, userId: "me", bookmarked: true });

    await ブックマーク状態を設定する({ pdId, userId: "me", bookmarked: true });

    const result = await ブックマークしたPD一覧を取得する({ userId: "me" });
    expect(result.items).toHaveLength(1);
  });

  it("ブックマークを外した PD は一覧から消える", async () => {
    const [pdId] = await PDを用意する(1);
    await ブックマーク状態を設定する({ pdId, userId: "me", bookmarked: true });

    await ブックマーク状態を設定する({ pdId, userId: "me", bookmarked: false });

    const result = await ブックマークしたPD一覧を取得する({ userId: "me" });
    expect(result.items).toHaveLength(0);
  });

  it("他のユーザーがブックマークした PD は自分の一覧に現れない", async () => {
    const [mine, others] = await PDを用意する(2);
    await ブックマーク状態を設定する({
      pdId: mine,
      userId: "me",
      bookmarked: true,
    });

    await ブックマーク状態を設定する({
      pdId: others,
      userId: "someone",
      bookmarked: true,
    });

    const result = await ブックマークしたPD一覧を取得する({ userId: "me" });
    expect(result.items.map((item) => item.id)).toEqual([mine]);
  });

  it("保存した PD は投稿日時ではなく保存した日時の新しい順に並ぶ", async () => {
    const [older, newer] = await PDを用意する(2);
    await ctx.db.insert(pdBookmarks).values([
      {
        targetPdId: newer,
        userId: "me",
        createdAt: new Date("2026-07-01T00:00:00.000Z"),
      },
      {
        targetPdId: older,
        userId: "me",
        createdAt: new Date("2026-07-02T00:00:00.000Z"),
      },
    ]);

    const result = await ブックマークしたPD一覧を取得する({ userId: "me" });

    expect(result.items.map((item) => item.id)).toEqual([older, newer]);
  });

  it("保存日時が同じ PD が一ページを超えても全件をページングで取得できる", async () => {
    const total = 25;
    const ids = await PDを用意する(total);
    const sameInstant = new Date("2026-07-01T00:00:00.000Z");
    await ctx.db.insert(pdBookmarks).values(
      ids.map((targetPdId) => ({
        targetPdId,
        userId: "me",
        createdAt: sameInstant,
      })),
    );

    const collected: string[] = [];
    let cursor: string | undefined;
    for (let page = 0; page < total + 1; page += 1) {
      const result = await ブックマークしたPD一覧を取得する({
        userId: "me",
        cursor,
      });
      collected.push(...result.items.map((item) => item.id));
      if (!result.nextCursor) break;
      cursor = result.nextCursor;
    }

    expect([...collected].sort()).toEqual([...ids].sort());
  });

  it("続き位置にした PD の保存が外されても、残りの保存した PD を続きとして取得できる", async () => {
    const total = 25;
    const ids = await PDを用意する(total);
    const base = new Date("2026-07-01T00:00:00.000Z");
    await ctx.db.insert(pdBookmarks).values(
      ids.map((targetPdId, index) => ({
        targetPdId,
        userId: "me",
        createdAt: new Date(base.getTime() + index * 1000),
      })),
    );
    const firstPage = await ブックマークしたPD一覧を取得する({ userId: "me" });
    const lastOfFirstPage = firstPage.items[firstPage.items.length - 1].id;
    await ブックマーク状態を設定する({
      pdId: lastOfFirstPage,
      userId: "me",
      bookmarked: false,
    });

    const secondPage = await ブックマークしたPD一覧を取得する({
      userId: "me",
      cursor: firstPage.nextCursor,
    });

    expect(secondPage.items).toHaveLength(total - firstPage.items.length);
  });

  it("マイクロ秒まで違う保存日時でも、続きの取得で重複も欠落もしない", async () => {
    const ids = await PDを用意する(21);
    await ctx.db.execute(
      sql.raw(
        `INSERT INTO pd_bookmarks (target_pd_id, user_id, created_at) VALUES ${ids
          .map(
            (id, index) =>
              `('${id}', 'me', '2026-07-01 00:00:00.${String(index * 7 + 1).padStart(6, "0")}')`,
          )
          .join(", ")}`,
      ),
    );

    const firstPage = await ブックマークしたPD一覧を取得する({ userId: "me" });
    const secondPage = await ブックマークしたPD一覧を取得する({
      userId: "me",
      cursor: firstPage.nextCursor,
    });

    expect(
      [...firstPage.items, ...secondPage.items].map((item) => item.id).sort(),
    ).toEqual([...ids].sort());
  });

  it("渡した PD のうち自分がブックマークしたものだけを返す", async () => {
    const [bookmarked, notBookmarked, othersBookmark] = await PDを用意する(3);
    await ブックマーク状態を設定する({
      pdId: bookmarked,
      userId: "me",
      bookmarked: true,
    });
    await ブックマーク状態を設定する({
      pdId: othersBookmark,
      userId: "someone",
      bookmarked: true,
    });

    const result = await Effect.runPromise(
      PdRepository.pipe(
        Effect.flatMap((repo) =>
          repo.ブックマーク済みのPDIDを絞り込む({
            userId: "me",
            pdIds: [bookmarked, notBookmarked, othersBookmark],
          }),
        ),
        Effect.provide(レイヤー(ctx.db)),
      ),
    );

    expect(result).toEqual([bookmarked]);
  });
});

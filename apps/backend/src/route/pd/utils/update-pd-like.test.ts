import { eq } from "drizzle-orm";
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
import type { DbClient } from "#/lib/db";
import { pdLikes, pds } from "../../../db/schema";
import {
  テストDBをリセットする,
  テストDBを削除する,
  テストDBを起動する,
} from "../../../utils/test/setup-db";
import { PDのいいね状態を更新する } from "./update-pd-like";

describe("PDのいいね状態を更新する", () => {
  const ctx = {} as {
    db: DbClient;
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

  it("いいねが存在しない場合、新しいいいねを作成する", async () => {
    const userId = "test";
    await ctx.db.insert(pds).values({
      id: ctx.pdId,
      content: "テストPD",
      createdAt: new Date(),
      userId: userId,
    });

    await PDのいいね状態を更新する({
      pdId: ctx.pdId,
      ログイン中のユーザーID: userId,
      db: ctx.db,
    });

    const likes = await ctx.db
      .select()
      .from(pdLikes)
      .where(eq(pdLikes.targetPdId, ctx.pdId));
    expect(likes).toHaveLength(1);
    expect(likes[0].userId).toBe(userId);
    expect(likes[0].targetPdId).toBe(ctx.pdId);
  });

  it("いいねが既に存在する場合、いいねを削除する", async () => {
    const userId = "test";
    await ctx.db.insert(pds).values({
      id: ctx.pdId,
      content: "テストPD",
      createdAt: new Date(),
      userId: userId,
    });
    await ctx.db.insert(pdLikes).values({
      targetPdId: ctx.pdId,
      userId: userId,
    });

    await PDのいいね状態を更新する({
      pdId: ctx.pdId,
      ログイン中のユーザーID: userId,
      db: ctx.db,
    });

    const likes = await ctx.db
      .select()
      .from(pdLikes)
      .where(eq(pdLikes.targetPdId, ctx.pdId));
    expect(likes).toHaveLength(0);
  });

  it("複数のユーザーがいいねをできる", async () => {
    const userId1 = "test1";
    const userId2 = "test2";
    await ctx.db.insert(pds).values({
      id: ctx.pdId,
      content: "テストPD",
      createdAt: new Date(),
      userId: userId1,
    });

    await PDのいいね状態を更新する({
      pdId: ctx.pdId,
      ログイン中のユーザーID: userId1,
      db: ctx.db,
    });
    await PDのいいね状態を更新する({
      pdId: ctx.pdId,
      ログイン中のユーザーID: userId2,
      db: ctx.db,
    });

    const likes = await ctx.db
      .select()
      .from(pdLikes)
      .where(eq(pdLikes.targetPdId, ctx.pdId));
    expect(likes).toHaveLength(2);
  });

  it("対象ユーザーのいいねだけを更新できる", async () => {
    const userId1 = "test1";
    const userId2 = "test2";
    await ctx.db.insert(pds).values({
      id: ctx.pdId,
      content: "テストPD",
      createdAt: new Date(),
      userId: userId1,
    });
    await ctx.db.insert(pdLikes).values({
      targetPdId: ctx.pdId,
      userId: userId1,
    });
    await ctx.db.insert(pdLikes).values({
      targetPdId: ctx.pdId,
      userId: userId2,
    });

    await PDのいいね状態を更新する({
      pdId: ctx.pdId,
      ログイン中のユーザーID: userId1,
      db: ctx.db,
    });

    const likes = await ctx.db
      .select()
      .from(pdLikes)
      .where(eq(pdLikes.targetPdId, ctx.pdId));
    expect(likes).toHaveLength(1);
  });
});

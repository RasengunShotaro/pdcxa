import { createClerkClient } from "@clerk/backend";
import { Effect, Layer } from "effect";
import { describe, expect, it } from "vitest";
import { AuthContext } from "#/domain/auth/principal";
import { ClerkClientPort } from "#/domain/clerk/client";
import { UserNotFoundError } from "#/domain/errors";
import { PdRepository } from "#/domain/pd/repository";
import type { PdPage, RawPd } from "#/domain/pd/types";
import { type UserDetail, UserDirectory } from "#/domain/user/service";
import { PD一覧を取得する } from "./fetch-pds";

const 未使用 = () => Effect.die(new Error("このテストでは呼ばれない"));

const ダミーClerk = createClerkClient({ secretKey: "sk_test_dummy" });

const rawPd = (over: Partial<RawPd>): RawPd => ({
  id: "p1",
  content: "c",
  createdAt: new Date("2026-06-24T00:00:00.000Z"),
  userId: "u1",
  imageFileName: null,
  likeCount: 0,
  replyCount: 0,
  likes: [],
  ...over,
});

const テスト環境 = (params: {
  page?: PdPage;
  byId?: RawPd[];
  ユーザー詳細?: UserDetail;
  一覧スパイ?: (input: { userId?: string; cursor?: string }) => void;
}) =>
  Layer.mergeAll(
    Layer.succeed(PdRepository, {
      一覧を取得する: (input) => {
        params.一覧スパイ?.(input);
        return Effect.succeed(
          params.page ?? { items: [], nextCursor: undefined },
        );
      },
      IDで取得する: () => Effect.succeed(params.byId ?? []),
      作成する: 未使用,
      いいねをトグルする: 未使用,
      日毎の集計を取得する: 未使用,
      投稿者別集計を取得する: 未使用,
    }),
    Layer.succeed(UserDirectory, {
      ユーザー名で取得する: (userName) =>
        params.ユーザー詳細
          ? Effect.succeed(params.ユーザー詳細)
          : Effect.fail(new UserNotFoundError({ userName })),
      ユーザーID一覧で取得する: 未使用,
    }),
    Layer.succeed(AuthContext, { userId: "u1" }),
    Layer.succeed(ClerkClientPort, ダミーClerk),
  );

describe("PD一覧を取得する", () => {
  it("ログイン中ユーザーの PD には isMyPd=true、他人の PD には false を付ける", async () => {
    const layer = テスト環境({
      page: {
        items: [
          rawPd({ id: "p1", userId: "u1" }),
          rawPd({ id: "p2", userId: "u9" }),
        ],
        nextCursor: undefined,
      },
    });

    const result = await Effect.runPromise(
      PD一覧を取得する({}).pipe(Effect.provide(layer)),
    );

    expect(result.items.map((i) => ({ id: i.id, isMyPd: i.isMyPd }))).toEqual([
      { id: "p1", isMyPd: true },
      { id: "p2", isMyPd: false },
    ]);
  });

  it("userName 指定時は UserDirectory で userId を解決して絞り込みに渡す", async () => {
    let 受け取ったuserId: string | undefined;
    const layer = テスト環境({
      ユーザー詳細: {
        id: "u2",
        firstName: null,
        lastName: null,
        imageUrl: "https://img/x.png",
        userName: "taro",
      },
      一覧スパイ: (input) => {
        受け取ったuserId = input.userId;
      },
    });

    await Effect.runPromise(
      PD一覧を取得する({ userName: "taro" }).pipe(Effect.provide(layer)),
    );

    expect(受け取ったuserId).toBe("u2");
  });

  it("pdId 指定時は IDで取得する経由で取得し nextCursor は undefined になる", async () => {
    const layer = テスト環境({
      byId: [rawPd({ id: "p1", userId: "u9" })],
    });

    const result = await Effect.runPromise(
      PD一覧を取得する({ pdId: "p1" }).pipe(Effect.provide(layer)),
    );

    expect(result.items).toHaveLength(1);
    expect(result.items[0].isMyPd).toBe(false);
    expect(result.nextCursor).toBeUndefined();
  });
});

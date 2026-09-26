import { Effect, Layer } from "effect";
import { describe, expect, it } from "vitest";
import { AuthContext } from "#/domain/auth/principal";
import { PdRepository } from "#/domain/pd/repository";
import type { RawPd } from "#/domain/pd/types";
import { ブックマークしたPD一覧を取得する } from "./fetch-bookmarked-pds";

const 未使用 = () => Effect.die(new Error("このテストでは呼ばれない"));

const rawPd = (over: Partial<RawPd>): RawPd => ({
  id: "p1",
  content: "c",
  createdAt: new Date("2026-06-24T00:00:00.000Z"),
  userId: "author",
  imageFileName: null,
  likeCount: 0,
  replyCount: 0,
  likes: [],
  quotedPd: null,
  quoteCount: 0,
  ...over,
});

const ブックマーク保存先 = (保存済み: Record<string, string[]>) => {
  const 一覧を取得したユーザー: string[] = [];
  const layer = Layer.succeed(PdRepository, {
    一覧を取得する: 未使用,
    IDで取得する: 未使用,
    作成する: 未使用,
    いいねをトグルする: 未使用,
    日毎の集計を取得する: 未使用,
    投稿者別集計を取得する: 未使用,
    ブックマーク状態を設定する: 未使用,
    ブックマーク済みのPDIDを絞り込む: ({ userId, pdIds }) =>
      Effect.succeed(
        (保存済み[userId] ?? []).filter((id) => pdIds.includes(id)),
      ),
    ブックマークしたPD一覧を取得する: ({ userId }) => {
      一覧を取得したユーザー.push(userId);
      return Effect.succeed({
        items: (保存済み[userId] ?? []).map((id) => rawPd({ id })),
        nextCursor: undefined,
      });
    },
  });
  return { layer, 一覧を取得したユーザー };
};

const 閲覧者として実行する = (
  userId: string,
  layer: Layer.Layer<PdRepository>,
) =>
  Effect.runPromise(
    ブックマークしたPD一覧を取得する({}).pipe(
      Effect.provide(layer),
      Effect.provideService(AuthContext, { userId }),
    ),
  );

describe("ブックマークしたPD一覧を取得する", () => {
  it("ログイン中ユーザー自身の保存した PD だけを返す", async () => {
    const { layer } = ブックマーク保存先({ me: ["p1"], someone: ["p2"] });

    const result = await 閲覧者として実行する("me", layer);

    expect(result.items.map((item) => item.id)).toEqual(["p1"]);
  });

  it("保存した PD の一覧はすべて保存済みとして示す", async () => {
    const { layer } = ブックマーク保存先({ me: ["p1", "p2"] });

    const result = await 閲覧者として実行する("me", layer);

    expect(result.items.every((item) => item.isBookmarked)).toBe(true);
  });

  it("保存一覧はログイン中ユーザーの保存として取得する", async () => {
    const { layer, 一覧を取得したユーザー } = ブックマーク保存先({
      me: ["p1"],
    });

    await 閲覧者として実行する("me", layer);

    expect(一覧を取得したユーザー).toEqual(["me"]);
  });
});

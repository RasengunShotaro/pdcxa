import { Effect, Either, Layer } from "effect";
import { describe, expect, it } from "vitest";
import { PdRepository } from "#/domain/pd/repository";
import type { RawPd } from "#/domain/pd/types";
import { 引用元のPDを確かめる } from "./verify-quoted-pd";

const 未使用 = () => Effect.die(new Error("このテストでは呼ばれない"));

const rawPd = (id: string): RawPd => ({
  id,
  content: "引用元",
  createdAt: new Date("2026-03-12T00:00:00.000Z"),
  userId: "author",
  imageFileName: null,
  likeCount: 0,
  replyCount: 0,
  likes: [],
  quotedPd: null,
  quoteCount: 0,
});

const 既存のPD = (ids: string[]) =>
  Layer.succeed(PdRepository, {
    一覧を取得する: 未使用,
    IDで取得する: (pdId) =>
      Effect.succeed(ids.includes(pdId) ? [rawPd(pdId)] : []),
    作成する: 未使用,
    いいねをトグルする: 未使用,
    日毎の集計を取得する: 未使用,
    投稿者別集計を取得する: 未使用,
    ブックマーク状態を設定する: 未使用,
    ブックマーク済みのPDIDを絞り込む: 未使用,
    ブックマークしたPD一覧を取得する: 未使用,
  });

const 確かめる = (quotedPdId: string | undefined, ids: string[]) =>
  Effect.runPromise(
    Effect.either(
      引用元のPDを確かめる(quotedPdId).pipe(Effect.provide(既存のPD(ids))),
    ),
  );

describe("引用元のPDを確かめる", () => {
  it("引用しないときは引用元なしとして通す", async () => {
    const result = await 確かめる(undefined, []);

    expect(result).toEqual(Either.right(null));
  });

  it("存在する PD を引用するときはその PD を引用元にする", async () => {
    const result = await 確かめる("pd-1", ["pd-1"]);

    expect(result).toEqual(Either.right("pd-1"));
  });

  it("存在しない PD を引用しようとすると引用元が見つからない失敗になる", async () => {
    const result = await 確かめる("pd-missing", ["pd-1"]);

    expect(Either.isLeft(result) && result.left._tag).toBe(
      "QuotedPdNotFoundError",
    );
  });
});

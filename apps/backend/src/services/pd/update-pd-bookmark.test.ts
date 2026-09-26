import { Effect, Layer } from "effect";
import { describe, expect, it } from "vitest";
import { AuthContext } from "#/domain/auth/principal";
import { PdRepository } from "#/domain/pd/repository";
import { PDのブックマーク状態を更新する } from "./update-pd-bookmark";

const 未使用 = () => Effect.die(new Error("このテストでは呼ばれない"));

const ブックマーク記録先 = () => {
  const 記録: { pdId: string; userId: string; bookmarked: boolean }[] = [];
  const layer = Layer.succeed(PdRepository, {
    一覧を取得する: 未使用,
    IDで取得する: 未使用,
    作成する: 未使用,
    いいねをトグルする: 未使用,
    日毎の集計を取得する: 未使用,
    投稿者別集計を取得する: 未使用,
    ブックマーク済みのPDIDを絞り込む: 未使用,
    ブックマークしたPD一覧を取得する: 未使用,
    ブックマーク状態を設定する: (params) => {
      記録.push({ ...params });
      return Effect.void;
    },
  });
  return { layer, 記録 };
};

describe("PDのブックマーク状態を更新する", () => {
  it("ログイン中ユーザーのブックマークとして保存状態を反映する", async () => {
    const { layer, 記録 } = ブックマーク記録先();

    await Effect.runPromise(
      PDのブックマーク状態を更新する({ pdId: "p1", bookmarked: true }).pipe(
        Effect.provide(layer),
        Effect.provideService(AuthContext, { userId: "me" }),
      ),
    );

    expect(記録).toEqual([{ pdId: "p1", userId: "me", bookmarked: true }]);
  });
});

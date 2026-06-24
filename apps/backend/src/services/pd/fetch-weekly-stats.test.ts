import { Effect, Layer } from "effect";
import { describe, expect, it } from "vitest";
import { PdRepository } from "#/domain/pd/repository";
import type { 投稿者別集計群, 日毎の集計, 集計期間 } from "#/domain/pd/types";
import { dayjs } from "#/lib/dayjs";
import { PD週間統計を取得する } from "./fetch-weekly-stats";

const 未使用 = () => Effect.die(new Error("このテストでは呼ばれない"));

const PdRepositoryモック = (params: {
  日毎の集計: 日毎の集計;
  投稿者別集計: 投稿者別集計群;
}) =>
  Layer.succeed(PdRepository, {
    一覧を取得する: 未使用,
    IDで取得する: 未使用,
    作成する: 未使用,
    いいねをトグルする: 未使用,
    日毎の集計を取得する: (_range: 集計期間) =>
      Effect.succeed(params.日毎の集計),
    投稿者別集計を取得する: (_range: 集計期間) =>
      Effect.succeed(params.投稿者別集計),
  });

describe("PD週間統計を取得する", () => {
  it("PD数が同数なら RePD数の多い投稿者を上位にランキングする", async () => {
    const layer = PdRepositoryモック({
      日毎の集計: { 日毎のPD数: [], 日毎のRePD数: [], 日毎のいいね数: [] },
      投稿者別集計: {
        ユーザーごとのPD数: [
          { userId: "u1", value: 5 },
          { userId: "u2", value: 5 },
        ],
        ユーザーごとのいいね数: [{ userId: "u2", value: 10 }],
        ユーザーごとのRePD数: [{ userId: "u1", value: 3 }],
      },
    });

    const result = await Effect.runPromise(
      PD週間統計を取得する().pipe(Effect.provide(layer)),
    );

    expect(result.rankings.map((r) => r.userId)).toEqual(["u1", "u2"]);
    expect(result.rankings[0]).toMatchObject({
      userId: "u1",
      pdCount: 5,
      rePdCount: 3,
      likeCount: 0,
    });
    expect(result.totals.activeAuthorCount).toBe(2);
  });

  it("投稿者がいない場合は averagePdPerAuthor を 0 にする", async () => {
    const layer = PdRepositoryモック({
      日毎の集計: { 日毎のPD数: [], 日毎のRePD数: [], 日毎のいいね数: [] },
      投稿者別集計: {
        ユーザーごとのPD数: [],
        ユーザーごとのいいね数: [],
        ユーザーごとのRePD数: [],
      },
    });

    const result = await Effect.runPromise(
      PD週間統計を取得する().pipe(Effect.provide(layer)),
    );

    expect(result.totals.activeAuthorCount).toBe(0);
    expect(result.totals.averagePdPerAuthor).toBe(0);
    expect(result.daily).toHaveLength(7);
  });

  it("日次集計を該当日付の daily 行に載せ合計を totals に反映する", async () => {
    const 今日のJSTキー = dayjs().tz("Asia/Tokyo").format("YYYY-MM-DD");
    const layer = PdRepositoryモック({
      日毎の集計: {
        日毎のPD数: [{ 集計日: `${今日のJSTキー}T00:00:00`, count: 3 }],
        日毎のRePD数: [{ 集計日: `${今日のJSTキー}T00:00:00`, count: 2 }],
        日毎のいいね数: [{ 集計日: `${今日のJSTキー}T00:00:00`, count: 5 }],
      },
      投稿者別集計: {
        ユーザーごとのPD数: [{ userId: "u1", value: 3 }],
        ユーザーごとのいいね数: [],
        ユーザーごとのRePD数: [],
      },
    });

    const result = await Effect.runPromise(
      PD週間統計を取得する().pipe(Effect.provide(layer)),
    );

    const 今日の行 = result.daily.find((d) => d.date === 今日のJSTキー);
    expect(今日の行).toEqual({
      date: 今日のJSTキー,
      pdCount: 3,
      rePdCount: 2,
      likeCount: 5,
    });
    expect(result.totals).toMatchObject({
      pdCount: 3,
      rePdCount: 2,
      likeCount: 5,
    });
  });
});

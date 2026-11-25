import { Effect, Layer } from "effect";
import { describe, expect, it } from "vitest";
import { AuthContext } from "#/domain/auth/principal";
import { PdRepository } from "#/domain/pd/repository";
import type { あしあとの一日, 投稿者の日毎の活動 } from "#/domain/pd/types";
import { dayjs } from "#/lib/dayjs";
import {
  あしあとを取得する,
  連続して活動した日数を数える,
} from "./fetch-footprint";

const 未使用 = () => Effect.die(new Error("このテストでは呼ばれない"));

const リポジトリを用意する = (活動: 投稿者の日毎の活動) => {
  const 問い合わせた投稿者: string[] = [];
  const layer = Layer.mergeAll(
    Layer.succeed(PdRepository, {
      一覧を取得する: 未使用,
      IDで取得する: 未使用,
      作成する: 未使用,
      いいねをトグルする: 未使用,
      ブックマーク状態を設定する: 未使用,
      ブックマーク済みのPDIDを絞り込む: 未使用,
      ブックマークしたPD一覧を取得する: 未使用,
      日毎の集計を取得する: 未使用,
      投稿者別集計を取得する: 未使用,
      投稿者の日毎の活動を取得する: ({ userId }) => {
        問い合わせた投稿者.push(userId);
        return Effect.succeed(活動);
      },
    }),
    Layer.succeed(AuthContext, { userId: "me" }),
  );
  return { layer, 問い合わせた投稿者 };
};

const 一日 = (overrides: Partial<あしあとの一日> = {}): あしあとの一日 => ({
  date: "2026-11-25",
  pdCount: 0,
  rePdCount: 0,
  likeCount: 0,
  ...overrides,
});

describe("あしあとを取得する", () => {
  it("今日までの 52 週間ぶんの日を古い順に並べる", async () => {
    const { layer } = リポジトリを用意する({
      日毎のPD数: [],
      日毎のRePD数: [],
      日毎のいいね数: [],
    });

    const result = await Effect.runPromise(
      あしあとを取得する().pipe(Effect.provide(layer)),
    );

    expect(result.days).toHaveLength(364);
    expect(result.days.at(-1)?.date).toBe(
      dayjs().tz("Asia/Tokyo").format("YYYY-MM-DD"),
    );
  });

  it("その日の PD・RePD・いいねの件数を該当する日に載せる", async () => {
    const 今日 = dayjs().tz("Asia/Tokyo").format("YYYY-MM-DD");
    const { layer } = リポジトリを用意する({
      日毎のPD数: [{ 集計日: `${今日}T00:00:00`, count: 3 }],
      日毎のRePD数: [{ 集計日: `${今日}T00:00:00`, count: 2 }],
      日毎のいいね数: [{ 集計日: `${今日}T00:00:00`, count: 7 }],
    });

    const result = await Effect.runPromise(
      あしあとを取得する().pipe(Effect.provide(layer)),
    );

    expect(result.days.at(-1)).toEqual({
      date: 今日,
      pdCount: 3,
      rePdCount: 2,
      likeCount: 7,
    });
  });

  it("いいねをもらっただけの日は、連続して活動した日に数えない", async () => {
    const 今日 = dayjs().tz("Asia/Tokyo").format("YYYY-MM-DD");
    const { layer } = リポジトリを用意する({
      日毎のPD数: [],
      日毎のRePD数: [],
      日毎のいいね数: [{ 集計日: `${今日}T00:00:00`, count: 4 }],
    });

    const result = await Effect.runPromise(
      あしあとを取得する().pipe(Effect.provide(layer)),
    );

    expect(result.currentStreak).toBe(0);
  });

  it("ログインしている本人の活動だけを問い合わせる", async () => {
    const { layer, 問い合わせた投稿者 } = リポジトリを用意する({
      日毎のPD数: [],
      日毎のRePD数: [],
      日毎のいいね数: [],
    });

    await Effect.runPromise(あしあとを取得する().pipe(Effect.provide(layer)));

    expect(問い合わせた投稿者).toEqual(["me"]);
  });
});

describe("連続して活動した日数を数える", () => {
  it("日が 1 つも無ければ連続は無い", () => {
    expect(連続して活動した日数を数える([])).toBe(0);
  });

  it("今日まで途切れずに活動した日数を数える", () => {
    const days = [
      一日({ date: "2026-11-22" }),
      一日({ date: "2026-11-23", pdCount: 1 }),
      一日({ date: "2026-11-24", rePdCount: 2 }),
      一日({ date: "2026-11-25", pdCount: 1 }),
    ];

    expect(連続して活動した日数を数える(days)).toBe(3);
  });

  it("今日まだ活動していなくても、昨日までの連続は途切れたことにしない", () => {
    const days = [
      一日({ date: "2026-11-23", pdCount: 1 }),
      一日({ date: "2026-11-24", pdCount: 1 }),
      一日({ date: "2026-11-25" }),
    ];

    expect(連続して活動した日数を数える(days)).toBe(2);
  });

  it("昨日も今日も活動していなければ連続は無い", () => {
    const days = [
      一日({ date: "2026-11-23", pdCount: 4 }),
      一日({ date: "2026-11-24" }),
      一日({ date: "2026-11-25" }),
    ];

    expect(連続して活動した日数を数える(days)).toBe(0);
  });

  it("期間の最初からずっと活動していれば期間の日数ぶん連続している", () => {
    const days = [
      一日({ date: "2026-11-24", pdCount: 1 }),
      一日({ date: "2026-11-25", rePdCount: 1 }),
    ];

    expect(連続して活動した日数を数える(days)).toBe(2);
  });
});

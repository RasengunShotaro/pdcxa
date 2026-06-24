import { Effect } from "effect";
import type { DatabaseError } from "#/domain/errors";
import { PdRepository } from "#/domain/pd/repository";
import type {
  投稿者別集計,
  日次集計,
  週間ランキング行,
  週間統計,
  集計期間,
} from "#/domain/pd/types";
import { dayjs } from "#/lib/dayjs";

const 取得対象日数 = 7;
const JST = "Asia/Tokyo";

const DateをYYYY_MM_DDに変換する = (date: Date): string =>
  dayjs(date).tz(JST).format("YYYY-MM-DD");

const 週次集計期間を決定する = (): 集計期間 => {
  const now = dayjs().tz(JST);
  const end = now.endOf("day");
  const start = end
    .clone()
    .subtract(取得対象日数 - 1, "day")
    .startOf("day");

  return { start: start.utc().toDate(), end: end.utc().toDate() };
};

const 期間内の日別一覧を作成する = ({ start }: 集計期間): string[] => {
  const 開始日 = dayjs(start).tz(JST);
  return Array.from({ length: 取得対象日数 }, (_, offset) =>
    開始日.add(offset, "day").format("YYYY-MM-DD"),
  );
};

const 日次集計Mapを作成する = (
  日次集計一覧: readonly 日次集計[],
): Record<string, number> =>
  日次集計一覧.reduce<Record<string, number>>((map, 集計) => {
    const 日付 = 集計.集計日.slice(0, 10);
    map[日付] = Number(集計.count);
    return map;
  }, {});

const 投稿者別指標Mapを作成する = (
  投稿者別集計一覧: readonly 投稿者別集計[],
): Record<string, number> =>
  投稿者別集計一覧.reduce<Record<string, number>>((map, 集計) => {
    map[集計.userId] = Number(集計.value);
    return map;
  }, {});

const ランキングを並べる = (
  ユーザーごとのPD数: readonly 投稿者別集計[],
  いいねMap: Record<string, number>,
  rePdMap: Record<string, number>,
): 週間ランキング行[] =>
  ユーザーごとのPD数
    .map((row) => ({
      userId: row.userId,
      pdCount: Number(row.value),
      likeCount: いいねMap[row.userId] ?? 0,
      rePdCount: rePdMap[row.userId] ?? 0,
    }))
    .sort((a, b) => {
      if (b.pdCount !== a.pdCount) {
        return b.pdCount - a.pdCount;
      }
      if (b.rePdCount !== a.rePdCount) {
        return b.rePdCount - a.rePdCount;
      }
      if (b.likeCount !== a.likeCount) {
        return b.likeCount - a.likeCount;
      }
      return a.userId.localeCompare(b.userId);
    })
    .slice(0, 10);

export const PD週間統計を取得する = (): Effect.Effect<
  週間統計,
  DatabaseError,
  PdRepository
> =>
  Effect.gen(function* () {
    const repo = yield* PdRepository;
    const range = 週次集計期間を決定する();
    const 日別キー一覧 = 期間内の日別一覧を作成する(range);

    const [
      { 日毎のPD数, 日毎のRePD数, 日毎のいいね数 },
      { ユーザーごとのPD数, ユーザーごとのいいね数, ユーザーごとのRePD数 },
    ] = yield* Effect.all(
      [repo.日毎の集計を取得する(range), repo.投稿者別集計を取得する(range)],
      { concurrency: "unbounded" },
    );

    const pd日次集計Map = 日次集計Mapを作成する(日毎のPD数);
    const rePd日次集計Map = 日次集計Mapを作成する(日毎のRePD数);
    const いいね日次集計Map = 日次集計Mapを作成する(日毎のいいね数);

    const daily = 日別キー一覧.map((key) => ({
      date: key,
      pdCount: pd日次集計Map[key] ?? 0,
      rePdCount: rePd日次集計Map[key] ?? 0,
      likeCount: いいね日次集計Map[key] ?? 0,
    }));

    const 合計PD数 = daily.reduce((合計, item) => 合計 + item.pdCount, 0);
    const 合計RePD数 = daily.reduce((合計, item) => 合計 + item.rePdCount, 0);
    const 合計いいね数 = daily.reduce((合計, item) => 合計 + item.likeCount, 0);
    const アクティブユーザー = ユーザーごとのPD数.length;
    const 一人あたりのPD数 = アクティブユーザー
      ? Number((合計PD数 / アクティブユーザー).toFixed(2))
      : 0;

    const rankings = ランキングを並べる(
      ユーザーごとのPD数,
      投稿者別指標Mapを作成する(ユーザーごとのいいね数),
      投稿者別指標Mapを作成する(ユーザーごとのRePD数),
    );

    return {
      range: {
        start: DateをYYYY_MM_DDに変換する(range.start),
        end: DateをYYYY_MM_DDに変換する(range.end),
      },
      totals: {
        pdCount: 合計PD数,
        rePdCount: 合計RePD数,
        likeCount: 合計いいね数,
        activeAuthorCount: アクティブユーザー,
        averagePdPerAuthor: 一人あたりのPD数,
      },
      daily,
      rankings,
    };
  });

import { Effect } from "effect";
import { AuthContext } from "#/domain/auth/principal";
import type { DatabaseError } from "#/domain/errors";
import { PdRepository } from "#/domain/pd/repository";
import type {
  あしあと,
  あしあとの一日,
  日次集計,
  集計期間,
} from "#/domain/pd/types";
import { dayjs } from "#/lib/dayjs";

const 取得対象日数 = 52 * 7;
const JST = "Asia/Tokyo";

const あしあとの期間を決定する = (): 集計期間 => {
  const end = dayjs().tz(JST).endOf("day");
  const start = end
    .clone()
    .subtract(取得対象日数 - 1, "day")
    .startOf("day");

  return { start: start.utc().toDate(), end: end.utc().toDate() };
};

const 期間内の日付一覧を作成する = ({ start }: 集計期間): string[] => {
  const 開始日 = dayjs(start).tz(JST);
  return Array.from({ length: 取得対象日数 }, (_, offset) =>
    開始日.add(offset, "day").format("YYYY-MM-DD"),
  );
};

const 日付ごとの件数にする = (
  日次集計一覧: readonly 日次集計[],
): ReadonlyMap<string, number> =>
  new Map(
    日次集計一覧.map((集計) => [集計.集計日.slice(0, 10), Number(集計.count)]),
  );

const 活動した日か = (day: あしあとの一日): boolean =>
  day.pdCount + day.rePdCount > 0;

export const 連続して活動した日数を数える = (
  days: readonly あしあとの一日[],
): number => {
  if (days.length === 0) {
    return 0;
  }
  const 新しい順 = [...days].reverse();
  const 数え始め = 新しい順[0] && 活動した日か(新しい順[0]) ? 0 : 1;
  const 途切れた位置 = 新しい順
    .slice(数え始め)
    .findIndex((day) => !活動した日か(day));

  return 途切れた位置 === -1 ? 新しい順.length - 数え始め : 途切れた位置;
};

export const あしあとを取得する = (): Effect.Effect<
  あしあと,
  DatabaseError,
  PdRepository | AuthContext
> =>
  Effect.gen(function* () {
    const repo = yield* PdRepository;
    const { userId } = yield* AuthContext;
    const range = あしあとの期間を決定する();
    const 日付一覧 = 期間内の日付一覧を作成する(range);

    const { 日毎のPD数, 日毎のRePD数, 日毎のいいね数 } =
      yield* repo.投稿者の日毎の活動を取得する({ userId, range });
    const 日付ごとのPD数 = 日付ごとの件数にする(日毎のPD数);
    const 日付ごとのRePD数 = 日付ごとの件数にする(日毎のRePD数);
    const 日付ごとのいいね数 = 日付ごとの件数にする(日毎のいいね数);

    const days = 日付一覧.map((date) => ({
      date,
      pdCount: 日付ごとのPD数.get(date) ?? 0,
      rePdCount: 日付ごとのRePD数.get(date) ?? 0,
      likeCount: 日付ごとのいいね数.get(date) ?? 0,
    }));

    return {
      range: {
        start: 日付一覧[0] ?? "",
        end: 日付一覧[日付一覧.length - 1] ?? "",
      },
      days,
      currentStreak: 連続して活動した日数を数える(days),
    };
  });

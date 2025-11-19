import { and, eq, gte, lte, sql } from "drizzle-orm";
import { pdLikes, pds, rePds } from "../../../db/schema";
import { dayjs } from "../../../lib/dayjs";
import { db } from "../../../lib/db";
import type { PD週間統計 } from "../types/pd-weekly-stats";

const 取得対象日数 = 7;
const JST = "Asia/Tokyo";

type 日付範囲 = {
  start: Date;
  end: Date;
};

const DateをYYYY_MM_DDに変換する = (date: Date) =>
  dayjs(date).tz(JST).format("YYYY-MM-DD");

const 週次集計期間を決定する = (): 日付範囲 => {
  const now = dayjs().tz(JST);
  const end = now.endOf("day");
  const start = end
    .clone()
    .subtract(取得対象日数 - 1, "day")
    .startOf("day");

  return { start: start.utc().toDate(), end: end.utc().toDate() };
};

const 期間内の日別一覧を作成する = ({ start }: 日付範囲) => {
  const 開始日 = dayjs(start).tz(JST);
  const 日数 = 取得対象日数;
  return Array.from({ length: 日数 }, (_, offset) =>
    開始日.add(offset, "day").format("YYYY-MM-DD"),
  );
};

const 日次集計Mapを作成する = (
  日時集計一覧: { 集計日: string; count: number }[],
) =>
  日時集計一覧.reduce<Record<string, number>>((map, 集計) => {
    const 日付 = 集計.集計日.slice(0, 10);
    map[日付] = Number(集計.count);
    return map;
  }, {});

const 日毎の統計を取得する = async (range: 日付範囲) => {
  const { start, end } = range;
  const PD日付 = sql<string>`date_trunc('day', (${pds.createdAt} AT TIME ZONE 'UTC') AT TIME ZONE 'Asia/Tokyo')`;
  const RePD日付 = sql<string>`date_trunc('day', (${rePds.createdAt} AT TIME ZONE 'UTC') AT TIME ZONE 'Asia/Tokyo')`;
  const pd期間条件 = and(gte(pds.createdAt, start), lte(pds.createdAt, end));
  const repd期間条件 = and(
    gte(rePds.createdAt, start),
    lte(rePds.createdAt, end),
  );

  const [日毎のPD数, 日毎のRePD数, 日毎のいいね数] = await Promise.all([
    db
      .select({ 集計日: PD日付, count: sql<number>`count(*)` })
      .from(pds)
      .where(pd期間条件)
      .groupBy(PD日付),
    db
      .select({ 集計日: RePD日付, count: sql<number>`count(*)` })
      .from(rePds)
      .where(repd期間条件)
      .groupBy(RePD日付),
    db
      .select({
        集計日: PD日付,
        count: sql<number>`count(${pdLikes.userId})`,
      })
      .from(pdLikes)
      .innerJoin(pds, eq(pdLikes.targetPdId, pds.id))
      .where(pd期間条件)
      .groupBy(PD日付),
  ]);

  return {
    日毎のPD数,
    日毎のRePD数,
    日毎のいいね数,
  };
};

const 投稿者別指標Mapを作成する = (
  投稿者別集計一覧: { userId: string; value: number }[],
) =>
  投稿者別集計一覧.reduce<Record<string, number>>((map, 集計) => {
    map[集計.userId] = Number(集計.value);
    return map;
  }, {});

const 投稿者ランキングを取得する = async (range: 日付範囲) => {
  const { start, end } = range;
  const pd期間条件 = and(gte(pds.createdAt, start), lte(pds.createdAt, end));
  const repd期間条件 = and(
    gte(rePds.createdAt, start),
    lte(rePds.createdAt, end),
  );

  const [ユーザーごとのPD数, ユーザーごとのいいね数, ユーザーごとのRePD数] =
    await Promise.all([
      db
        .select({ userId: pds.userId, value: sql<number>`count(*)` })
        .from(pds)
        .where(pd期間条件)
        .groupBy(pds.userId),
      db
        .select({ userId: pdLikes.userId, value: sql<number>`count(*)` })
        .from(pdLikes)
        .innerJoin(pds, eq(pdLikes.targetPdId, pds.id))
        .where(pd期間条件)
        .groupBy(pdLikes.userId),
      db
        .select({ userId: rePds.userId, value: sql<number>`count(*)` })
        .from(rePds)
        .where(repd期間条件)
        .groupBy(rePds.userId),
    ]);

  const いいねMap = 投稿者別指標Mapを作成する(ユーザーごとのいいね数);
  const rePdMap = 投稿者別指標Mapを作成する(ユーザーごとのRePD数);

  const rankings = ユーザーごとのPD数
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

  return {
    rankings,
    アクティブユーザー: ユーザーごとのPD数.length,
  };
};

export const PD週間統計を取得する = async (): Promise<PD週間統計> => {
  const range = 週次集計期間を決定する();
  const 日別キー一覧 = 期間内の日別一覧を作成する(range);

  const [
    { 日毎のPD数, 日毎のRePD数, 日毎のいいね数 },
    { rankings, アクティブユーザー },
  ] = await Promise.all([
    日毎の統計を取得する(range),
    投稿者ランキングを取得する(range),
  ]);

  const pd日次集計Map = 日次集計Mapを作成する(日毎のPD数);
  const rePd日次集計Map = 日次集計Mapを作成する(日毎のRePD数);
  const いいね日次集計Map = 日次集計Mapを作成する(日毎のいいね数);

  const 週間PDCXA統計 = 日別キー一覧.map((key) => ({
    date: key,
    pdCount: pd日次集計Map[key] ?? 0,
    rePdCount: rePd日次集計Map[key] ?? 0,
    likeCount: いいね日次集計Map[key] ?? 0,
  }));

  const 合計PD数 = 週間PDCXA統計.reduce((合計, item) => 合計 + item.pdCount, 0);
  const 合計RePD数 = 週間PDCXA統計.reduce(
    (合計, item) => 合計 + item.rePdCount,
    0,
  );
  const 合計いいね数 = 週間PDCXA統計.reduce(
    (合計, item) => 合計 + item.likeCount,
    0,
  );
  const 一人あたりのPD数 = アクティブユーザー
    ? Number((合計PD数 / アクティブユーザー).toFixed(2))
    : 0;

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
    daily: 週間PDCXA統計,
    rankings,
  };
};

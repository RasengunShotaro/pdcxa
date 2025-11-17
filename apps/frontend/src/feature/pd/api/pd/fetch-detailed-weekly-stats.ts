"use server";

import { getClient } from "@/lib/hono";
import { 週次統計を詳細化する } from "../../utils/pd-stats-transformer";
import { fetchUserDetails } from "../fetch-user-details";

export const fetchDetailedPdWeeklyStats = async () => {
  const client = await getClient();
  const 週次統計 = await (await client.pd.stats.weekly.$get()).json();

  const 一意のユーザーID一覧 = [
    ...new Set(週次統計.rankings.map((ranking) => ranking.userId)),
  ];
  const ユーザー詳細一覧 = 一意のユーザーID一覧.length
    ? await fetchUserDetails(一意のユーザーID一覧)
    : [];

  return 週次統計を詳細化する({
    週次統計,
    ユーザー詳細一覧,
  });
};

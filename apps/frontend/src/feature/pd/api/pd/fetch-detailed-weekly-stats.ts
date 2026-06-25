import { fetchWeeklyStats } from "@/schema/api";
import { 週次統計を詳細化する } from "../../utils/pd-stats-transformer";
import { fetchUserDetails } from "../fetch-user-details";

export const fetchDetailedPdWeeklyStats = async () => {
  const 週次統計 = (await fetchWeeklyStats()).data;

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

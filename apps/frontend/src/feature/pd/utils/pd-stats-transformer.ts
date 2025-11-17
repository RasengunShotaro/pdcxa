import type { UserDetail } from "../types";
import type { PdWeeklyStats } from "../types/stats";
import { ユーザーのフルネームをフォーマットする } from "./pd-data-transformer";

export const 週次統計を詳細化する = ({
  週次統計,
  ユーザー詳細一覧,
}: {
  週次統計: PdWeeklyStats;
  ユーザー詳細一覧: UserDetail[];
}) => {
  const userMap = new Map(ユーザー詳細一覧.map((user) => [user.id, user]));

  return {
    ...週次統計,
    rankings: 週次統計.rankings.map((ranking) => {
      const detail = userMap.get(ranking.userId);
      return {
        ...ranking,
        displayName: ユーザーのフルネームをフォーマットする(detail),
        userName: detail?.userName ?? "",
        imageUrl: detail?.imageUrl ?? "",
      };
    }),
  };
};

import { useQueries } from "@tanstack/react-query";
import { fetchUserDetail } from "../feature/pd/api/fetch-user-detail";

export const useUserDetails = (userIds: string[]) => {
  const userQueries = useQueries({
    queries: userIds.map((userId) => ({
      queryKey: ["ユーザー詳細情報", userId],
      queryFn: async () => fetchUserDetail(userId),
      staleTime: 1000 * 60 * 15,
    })),
  });

  return userQueries.map((query) => query.data);
};

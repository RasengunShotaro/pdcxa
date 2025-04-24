import { useQuery } from "@tanstack/react-query";
import { fetchUserDetail } from "../feature/pd/api/fetch-user-detail";

export const useUserDetail = (userId: string) => {
  const { data } = useQuery({
    queryKey: ["ユーザー詳細情報", userId],
    queryFn: async () => fetchUserDetail(userId),
    staleTime: 1000 * 60 * 60,
  });

  return data;
};

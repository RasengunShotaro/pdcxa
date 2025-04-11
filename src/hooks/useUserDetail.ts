import { useQuery } from "@tanstack/react-query";
import { fetchUserDetail } from "../feature/pd/api/fetch-user-detail";

export const useUserDetail = (userId: string) => {
  const { data } = useQuery({
    queryKey: ["ユーザー詳細情報", userId],
    queryFn: async () => fetchUserDetail(userId),
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return data;
};

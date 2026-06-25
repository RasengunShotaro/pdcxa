import { fetchUserDetails as fetchUserDetailsApi } from "@/schema/api";

export const fetchUserDetails = async (userIds: string[]) => {
  if (userIds.length === 0) {
    return [];
  }

  return (await fetchUserDetailsApi({ userIds })).data;
};

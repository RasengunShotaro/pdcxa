import { cache } from "react";
import { getClient } from "@/lib/hono";

export const fetchUserDetails = cache(async (userIds: string[]) => {
  const client = await getClient();

  const response = await client.user.details.$get({
    query: {
      userIds: userIds.length > 1 ? userIds : [...userIds, ""], // クエリパラメータ配列の長さが1のときは配列とみなされないため
    },
  });
  const userDetails = await response.json();

  return userDetails;
});

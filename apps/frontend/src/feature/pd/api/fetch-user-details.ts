import { cache } from "react";
import { getClient } from "@/lib/hono";

export const fetchUserDetails = cache(async (userIds: string[]) => {
  if (userIds.length === 0) {
    return [];
  }

  const client = await getClient();

  const response = await client.user.details.$get({
    query: { userIds },
  });
  const userDetails = await response.json();

  if (!Array.isArray(userDetails)) {
    return [];
  }

  return userDetails;
});

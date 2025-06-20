import { cache } from "react";
import { getClient } from "@/lib/hono";

export const fetchUserDetails = cache(async (userIds: string[]) => {
  const client = await getClient();

  const response = await client.user.details.$get({
    query: {
      userIds,
    },
  });
  const userDetails = await response.json();

  return userDetails;
});

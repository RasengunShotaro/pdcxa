"use server";

import { cache } from "react";
import { getClient } from "@/lib/hono";

export const fetchUserDetail = cache(async (userName: string) => {
  const client = await getClient();

  const response = await client.user.detail.$get({
    query: {
      userName,
    },
  });
  const userDetail = await response.json();

  return userDetail;
});

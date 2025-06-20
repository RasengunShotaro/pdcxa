"use server";

import { getClient } from "@/lib/hono";

export const mutatePdLike = async (pdId: string) => {
  const client = await getClient();

  await client.pd.like.$put({
    json: {
      pdId,
    },
  });
};

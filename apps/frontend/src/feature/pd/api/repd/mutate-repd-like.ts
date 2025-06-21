"use server";

import { getClient } from "@/lib/hono";

export const mutateRePdLike = async (rePdId: string) => {
  const client = await getClient();

  await client.repd.like.$put({
    json: {
      rePdId,
    },
  });
};

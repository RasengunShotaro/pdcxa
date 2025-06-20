import { getClient } from "@/lib/hono";

export const fetchRawRePds = async (pdId: string) => {
  const client = await getClient();

  const response = await client.repd.$get({
    query: {
      pdId,
    },
  });
  const rePds = await response.json();

  return rePds;
};

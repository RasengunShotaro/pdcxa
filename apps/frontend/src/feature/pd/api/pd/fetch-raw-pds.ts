import { getClient } from "@/lib/hono";

export const fetchRawPds = async ({
  pdId,
  userName,
  cursor,
}: {
  pdId?: string;
  userName?: string;
  cursor?: string;
}) => {
  const client = await getClient();

  const response = await client.pd.$get({
    query: {
      pdId,
      userName,
      cursor,
    },
  });
  const PD一覧 = await response.json();

  return PD一覧;
};

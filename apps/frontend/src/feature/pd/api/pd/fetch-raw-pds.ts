import { fetchPds } from "@/schema/api";

export const fetchRawPds = async ({
  pdId,
  userName,
  cursor,
}: {
  pdId?: string;
  userName?: string;
  cursor?: string;
}) => {
  return (await fetchPds({ pdId, userName, cursor })).data;
};

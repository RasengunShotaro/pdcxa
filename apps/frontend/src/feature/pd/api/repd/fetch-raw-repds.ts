import { fetchRePds } from "@/schema/api";

export const fetchRawRePds = async (pdId: string) => {
  return (await fetchRePds({ pdId })).data;
};

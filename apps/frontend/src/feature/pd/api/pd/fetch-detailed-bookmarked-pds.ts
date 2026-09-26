import { fetchBookmarkedPds } from "@/schema/api";
import {
  PDを詳細化する,
  ユーザーIDリストを抽出する,
} from "../../utils/pd-data-transformer";
import { fetchUserDetails } from "../fetch-user-details";

export const fetchDetailedBookmarkedPds = async ({
  cursor,
}: {
  cursor?: string;
}) => {
  const { data } = await fetchBookmarkedPds(cursor ? { cursor } : undefined);

  const userDetails = await fetchUserDetails(
    ユーザーIDリストを抽出する(data.items),
  );

  return {
    items: PDを詳細化する(data.items, userDetails),
    nextCursor: data.nextCursor,
  };
};

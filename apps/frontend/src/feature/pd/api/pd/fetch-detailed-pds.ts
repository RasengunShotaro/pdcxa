"use server";

import {
  PDを詳細化する,
  ユーザーIDリストを抽出する,
} from "../../utils/pd-data-transformer";
import { fetchUserDetails } from "../fetch-user-details";
import { fetchRawPds } from "./fetch-raw-pds";

export const fetchDetailedPds = async ({
  pdId,
  userName,
  cursor,
}: {
  pdId?: string;
  userName?: string;
  cursor?: string;
}) => {
  const fetchedPds = await fetchRawPds({ pdId, userName, cursor });

  const userDetails = await fetchUserDetails(
    ユーザーIDリストを抽出する(fetchedPds.items),
  );

  return {
    items: PDを詳細化する(fetchedPds.items, userDetails),
    nextCursor: fetchedPds.nextCursor,
  };
};

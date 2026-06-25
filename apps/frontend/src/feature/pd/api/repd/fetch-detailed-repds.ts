import type { RePd } from "../../types";
import { RePdを詳細化する } from "../../utils/repd-data-transformer";
import { fetchUserDetails } from "../fetch-user-details";
import { fetchRawRePds } from "./fetch-raw-repds";

export const fetchDetailedRepds = async (pdId: string): Promise<RePd[]> => {
  const fetchedRePds = await fetchRawRePds(pdId);
  if (fetchedRePds.length === 0) {
    return [];
  }

  const allUserIds = fetchedRePds.flatMap((rePd) => {
    const likeUserIds = rePd.likes.map((like) => like.userId);
    return [rePd.userId, ...likeUserIds];
  });
  const uniqueUserIds = [...new Set(allUserIds)];
  const userDetails = await fetchUserDetails(uniqueUserIds);

  return RePdを詳細化する(fetchedRePds, userDetails);
};

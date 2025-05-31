"use server";

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

  const allUserIds = fetchedPds.items.flatMap((pd) => {
    const likeUserIds = pd.likes.map((like) => like.userId);
    return [pd.userId, ...likeUserIds];
  });
  const uniqueUserIds = [...new Set(allUserIds)];
  const userDetails = await fetchUserDetails(uniqueUserIds);
  const userDetailsMap = new Map(userDetails.map((user) => [user.id, user]));

  const detailedPds = fetchedPds.items.map((pd) => {
    const userDetail = userDetailsMap.get(pd.userId);
    const userFullName = `${userDetail?.first_name ?? ""} ${
      userDetail?.last_name ?? ""
    }`;

    const likeUserNames = pd.likes.map((like) => {
      const likeUserDetail = userDetailsMap.get(like.userId);
      return `${likeUserDetail?.first_name ?? ""} ${
        likeUserDetail?.last_name ?? ""
      }`;
    });

    return {
      ...pd,
      userDetail: {
        id: userDetail?.id ?? "",
        userFullName,
        imageUrl: userDetail?.image_url ?? "",
        userName: userDetail?.username ?? "",
      },
      likeUserNames,
    };
  });

  return {
    items: detailedPds,
    nextCursor: fetchedPds.nextCursor,
  };
};

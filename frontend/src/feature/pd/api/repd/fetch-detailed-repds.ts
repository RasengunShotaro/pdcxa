"use server";

import type { RePd } from "../../types";
import { fetchUserDetails } from "../fetch-user-details";
import { fetchRawRePds } from "./fetch-raw-repds";

export const fetchDetailedRepds = async (pdId: string): Promise<RePd[]> => {
  const fetchedRePds = await fetchRawRePds(pdId);

  const allUserIds = fetchedRePds.flatMap((rePd) => {
    const likeUserIds = rePd.likes.map((like) => like.userId);
    return [rePd.userId, ...likeUserIds];
  });
  const uniqueUserIds = [...new Set(allUserIds)];
  const userDetails = await fetchUserDetails(uniqueUserIds);
  const userDetailsMap = new Map(userDetails.map((user) => [user.id, user]));

  const detailedRePds = fetchedRePds.map((rePd) => {
    const userDetail = userDetailsMap.get(rePd.userId);
    const userFullName = `${userDetail?.firstName ?? ""} ${
      userDetail?.lastName ?? ""
    }`;

    const likeUserNames = rePd.likes.map((like) => {
      const likeUserDetail = userDetailsMap.get(like.userId);
      return `${likeUserDetail?.firstName ?? ""} ${
        likeUserDetail?.lastName ?? ""
      }`;
    });

    return {
      ...rePd,
      userDetail: {
        id: userDetail?.id ?? "",
        userFullName,
        imageUrl: userDetail?.imageUrl ?? "",
        userName: userDetail?.userName ?? "",
      },
      likeUserNames,
    };
  });

  return detailedRePds;
};

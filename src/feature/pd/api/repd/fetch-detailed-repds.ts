"use server";

import type { RePd } from "../../types";
import { fetchUserDetail } from "../fetch-user-detail";
import { fetchRawRePds } from "./fetch-raw-repds";

export const fetchDetailedRepds = async (pdId: string): Promise<RePd[]> => {
  const fetchedRePds = await fetchRawRePds(pdId);
  const detailedRePds = await Promise.all(
    fetchedRePds.map(async (rePd) => {
      const userDetail = await fetchUserDetail(rePd.userId);
      const userFullName = `${userDetail?.first_name ?? ""} ${
        userDetail?.last_name ?? ""
      }`;
      const likeUserNames = await Promise.all(
        rePd.likes.map(async (like) => {
          const likeUserDetail = await fetchUserDetail(like.userId);
          return `${likeUserDetail?.first_name ?? ""} ${
            likeUserDetail?.last_name ?? ""
          }`;
        })
      );
      return {
        ...rePd,
        userDetail: {
          id: userDetail?.id ?? "",
          userFullName,
          imageUrl: userDetail?.image_url ?? "",
          userName: userDetail?.username ?? "",
        },
        likeUserNames,
      };
    })
  );

  return detailedRePds;
};

import { fetchUserDetail } from "../fetch-user-detail";
import { fetchRawPds } from "./fetch-raw-pds";

export const fetchDetailedPds = async ({
  pdId,
  userId,
  cursor,
}: {
  pdId?: string;
  userId?: string;
  cursor?: string;
}) => {
  const fetchedPds = await fetchRawPds({ pdId, userId, cursor });
  const detailedPds = await Promise.all(
    fetchedPds.items.map(async (pd) => {
      const userDetail = await fetchUserDetail(pd.userId);
      const userFullName = `${userDetail?.first_name ?? ""} ${
        userDetail?.last_name ?? ""
      }`;
      const likeUserNames = await Promise.all(
        pd.likes.map(async (like) => {
          const likeUserDetail = await fetchUserDetail(like.userId);
          return `${likeUserDetail?.first_name ?? ""} ${
            likeUserDetail?.last_name ?? ""
          }`;
        })
      );
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
    })
  );

  return {
    items: detailedPds,
    nextCursor: fetchedPds.nextCursor,
  };
};

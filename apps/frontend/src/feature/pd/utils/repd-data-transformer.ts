import type { RawRePd, RePd, UserDetail } from "../types/pd";
import {
  いいねユーザーの名前リストを作成する,
  いいねユーザーの詳細リストを作成する,
  ユーザーのフルネームをフォーマットする,
  ユーザー詳細情報のMapを作成する,
} from "./pd-data-transformer";

export const RePdを詳細化する = (
  rawRePds: RawRePd[],
  userDetails: UserDetail[],
): RePd[] => {
  const userDetailsMap = ユーザー詳細情報のMapを作成する(userDetails);
  return rawRePds.map((rePd) => {
    const userDetail = userDetailsMap.get(rePd.userId);
    const userFullName = ユーザーのフルネームをフォーマットする(userDetail);
    const likeUserNames = いいねユーザーの名前リストを作成する(
      rePd.likes,
      userDetailsMap,
    );
    const likeUsers = いいねユーザーの詳細リストを作成する(
      rePd.likes,
      userDetailsMap,
    );
    return {
      ...rePd,
      userDetail: {
        id: userDetail?.id ?? "",
        userFullName,
        imageUrl: userDetail?.imageUrl ?? "",
        userName: userDetail?.userName ?? "",
      },
      likeUserNames,
      likeUsers,
    };
  });
};

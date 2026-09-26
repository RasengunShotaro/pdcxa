import { getApiErrorStatus } from "@/lib/api-error";
import { type ErrorDisplay, errorDisplay } from "@/lib/error-message";
import type { Pd, QuotedPd } from "../types";

export const PDを引用元にする = (pd: Pd): QuotedPd => ({
  id: pd.id,
  content: pd.content,
  createdAt: pd.createdAt,
  userId: pd.userId,
  userDetail: {
    userFullName: pd.userDetail.userFullName,
    imageUrl: pd.userDetail.imageUrl,
    userName: pd.userDetail.userName,
  },
});

const 引用元が見つからない表示: ErrorDisplay = {
  kind: "fatal",
  message: "引用元の PD が見つかりませんでした",
};

export const 投稿失敗の表示を決める = ({
  error,
  isQuoting,
}: {
  error: unknown;
  isQuoting: boolean;
}): ErrorDisplay =>
  isQuoting && getApiErrorStatus(error) === 404
    ? 引用元が見つからない表示
    : errorDisplay(error);

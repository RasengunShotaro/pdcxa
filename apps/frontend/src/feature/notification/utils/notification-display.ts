import type {
  NotificationActor,
  NotificationItem,
  NotificationKind,
} from "../types";

export const 行為者の表示名 = (actor: NotificationActor): string => {
  const fullName = `${actor.firstName ?? ""} ${actor.lastName ?? ""}`.trim();
  if (fullName) {
    return fullName;
  }
  if (actor.userName) {
    return `@${actor.userName}`;
  }
  return "退会したユーザー";
};

const 行為文言: Record<NotificationKind, string> = {
  pdLike: "あなたの PD にいいねしました",
  rePdLike: "あなたの RePd にいいねしました",
  rePd: "あなたの PD に RePd しました",
};

export const 通知の行為文言 = (kind: NotificationKind): string =>
  行為文言[kind];

export const 通知のリンク先 = (item: NotificationItem): string =>
  `/pd/${item.pdId}`;

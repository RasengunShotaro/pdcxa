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
  pdLike: "あなたのPDにいいねしました",
  rePdLike: "あなたのRePDにいいねしました",
  rePd: "あなたのPDにRePDしました",
};

export const 通知の行為文言 = (kind: NotificationKind): string =>
  行為文言[kind];

export const 通知のリンク先 = (item: NotificationItem): string =>
  `/pd/${item.pdId}`;

interface 最近の通知を選ぶInput {
  readonly notifications: readonly NotificationItem[];
  readonly limit: number;
}

export const 最近の通知を選ぶ = ({
  notifications,
  limit,
}: 最近の通知を選ぶInput): NotificationItem[] => notifications.slice(0, limit);

import type { NotificationItem } from "../types";

export const notificationKey = (item: NotificationItem): string =>
  `${item.kind}:${item.rePdId ?? item.pdId}:${item.actor.id}`;

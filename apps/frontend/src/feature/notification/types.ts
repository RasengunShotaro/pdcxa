import type { FetchNotifications200ItemsItem } from "@/schema/models/fetchNotifications200ItemsItem";

export type NotificationItem = FetchNotifications200ItemsItem;
export type NotificationActor = NotificationItem["actor"];
export type NotificationKind = NotificationItem["kind"];

import type { UserDetail } from "../user/service";

export type NotificationKind = "pdLike" | "rePdLike" | "rePd";

export type RawNotification = {
  readonly kind: NotificationKind;
  readonly actorUserId: string;
  readonly pdId: string;
  readonly rePdId: string | null;
  readonly excerpt: string;
  readonly createdAt: Date;
};

export type NotificationPage = {
  readonly items: RawNotification[];
  readonly nextCursor: string | undefined;
};

export type Notification = RawNotification & {
  readonly actor: UserDetail;
};

export type NotificationListPage = {
  readonly items: Notification[];
  readonly nextCursor: string | undefined;
};

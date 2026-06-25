import type { FetchNotifications200ItemsItemActor } from './fetchNotifications200ItemsItemActor';
import type { FetchNotifications200ItemsItemKind } from './fetchNotifications200ItemsItemKind';

export type FetchNotifications200ItemsItem = {
  kind: FetchNotifications200ItemsItemKind;
  actor: FetchNotifications200ItemsItemActor;
  pdId: string;
  rePdId: string | null;
  excerpt: string;
  createdAt: string;
};

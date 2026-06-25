import type { FetchNotifications200ItemsItem } from './fetchNotifications200ItemsItem';

export type FetchNotifications200 = {
  items: FetchNotifications200ItemsItem[];
  nextCursor?: string;
};

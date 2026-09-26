import type { FetchBookmarkedPds200ItemsItem } from './fetchBookmarkedPds200ItemsItem';

export type FetchBookmarkedPds200 = {
  items: FetchBookmarkedPds200ItemsItem[];
  nextCursor?: string;
};

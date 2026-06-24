import type { FetchPds200ItemsItem } from './fetchPds200ItemsItem';

export type FetchPds200 = {
  items: FetchPds200ItemsItem[];
  nextCursor?: string;
};

import type { FetchPds200ItemsItemLikesItem } from './fetchPds200ItemsItemLikesItem';
import type { FetchPds200ItemsItemQuotedPd } from './fetchPds200ItemsItemQuotedPd';

export type FetchPds200ItemsItem = {
  isMyPd: boolean;
  isBookmarked: boolean;
  quoteCount: number;
  /** @nullable */
  quotedPd: FetchPds200ItemsItemQuotedPd;
  likeCount: number;
  replyCount: number;
  likes: FetchPds200ItemsItemLikesItem[];
  id: string;
  content: string;
  createdAt: string;
  userId: string;
  /** @nullable */
  imageFileName: string | null;
};

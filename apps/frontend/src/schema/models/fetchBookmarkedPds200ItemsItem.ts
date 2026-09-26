import type { FetchBookmarkedPds200ItemsItemLikesItem } from './fetchBookmarkedPds200ItemsItemLikesItem';
import type { FetchBookmarkedPds200ItemsItemQuotedPd } from './fetchBookmarkedPds200ItemsItemQuotedPd';

export type FetchBookmarkedPds200ItemsItem = {
  isMyPd: boolean;
  isBookmarked: boolean;
  quoteCount: number;
  /** @nullable */
  quotedPd: FetchBookmarkedPds200ItemsItemQuotedPd;
  likeCount: number;
  replyCount: number;
  likes: FetchBookmarkedPds200ItemsItemLikesItem[];
  id: string;
  content: string;
  createdAt: string;
  userId: string;
  /** @nullable */
  imageFileName: string | null;
};

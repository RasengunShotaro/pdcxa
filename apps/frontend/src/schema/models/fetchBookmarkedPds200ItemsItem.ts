import type { FetchBookmarkedPds200ItemsItemLikesItem } from './fetchBookmarkedPds200ItemsItemLikesItem';

export type FetchBookmarkedPds200ItemsItem = {
  isMyPd: boolean;
  isBookmarked: boolean;
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

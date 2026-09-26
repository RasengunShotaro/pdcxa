import type { CreateGifPd201LikesItem } from './createGifPd201LikesItem';
import type { CreateGifPd201QuotedPd } from './createGifPd201QuotedPd';

export type CreateGifPd201 = {
  isMyPd: boolean;
  isBookmarked: boolean;
  quoteCount: number;
  /** @nullable */
  quotedPd: CreateGifPd201QuotedPd;
  likeCount: number;
  replyCount: number;
  likes: CreateGifPd201LikesItem[];
  id: string;
  content: string;
  createdAt: string;
  userId: string;
  /** @nullable */
  imageFileName: string | null;
};

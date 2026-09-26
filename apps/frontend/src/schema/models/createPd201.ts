import type { CreatePd201LikesItem } from './createPd201LikesItem';
import type { CreatePd201QuotedPd } from './createPd201QuotedPd';

export type CreatePd201 = {
  isMyPd: boolean;
  isBookmarked: boolean;
  quoteCount: number;
  /** @nullable */
  quotedPd: CreatePd201QuotedPd;
  likeCount: number;
  replyCount: number;
  likes: CreatePd201LikesItem[];
  id: string;
  content: string;
  createdAt: string;
  userId: string;
  /** @nullable */
  imageFileName: string | null;
};

import type { CreateGifPd201LikesItem } from './createGifPd201LikesItem';

export type CreateGifPd201 = {
  isMyPd: boolean;
  isBookmarked: boolean;
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

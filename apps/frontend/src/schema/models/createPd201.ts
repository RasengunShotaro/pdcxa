import type { CreatePd201LikesItem } from './createPd201LikesItem';

export type CreatePd201 = {
  isMyPd: boolean;
  isBookmarked: boolean;
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

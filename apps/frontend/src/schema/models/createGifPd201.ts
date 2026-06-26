import type { CreateGifPd201LikesItem } from './createGifPd201LikesItem';

export type CreateGifPd201 = {
  isMyPd: boolean;
  likeCount: number;
  replyCount: number;
  likes: CreateGifPd201LikesItem[];
  id: string;
  content: string;
  createdAt: string;
  userId: string;
  imageFileName: string | null;
};

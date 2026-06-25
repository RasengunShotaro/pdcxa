import type { FetchRePds200ItemLikesItem } from './fetchRePds200ItemLikesItem';

export type FetchRePds200Item = {
  isMyRePd: boolean;
  likeCount: number;
  likes: FetchRePds200ItemLikesItem[];
  id: string;
  content: string;
  createdAt: string;
  userId: string;
  pdId: string;
};

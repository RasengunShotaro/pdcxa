import type { FetchPds200ItemsItemLikesItem } from './fetchPds200ItemsItemLikesItem';

export type FetchPds200ItemsItem = {
  isMyPd: boolean;
  likeCount: number;
  replyCount: number;
  likes: FetchPds200ItemsItemLikesItem[];
  id: string;
  content: string;
  createdAt: string;
  userId: string;
  imageFileName: string | null;
};

export type RePD詳細 = {
  isMyRePd: boolean;
  likeCount: number;
  likes: {
    userId: string;
  }[];
  id: string;
  content: string;
  createdAt: Date;
  userId: string;
  pdId: string;
}[];

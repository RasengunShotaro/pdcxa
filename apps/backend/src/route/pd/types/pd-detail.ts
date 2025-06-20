export type PD詳細 = {
  items: {
    isMyPd: boolean;
    likeCount: number;
    replyCount: number;
    likes: {
      userId: string;
    }[];
    id: string;
    content: string;
    createdAt: Date;
    userId: string;
    imageFileName: string | null;
  }[];
  nextCursor: string | undefined;
};

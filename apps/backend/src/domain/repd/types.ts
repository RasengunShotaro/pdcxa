export type RePdLike = {
  readonly userId: string;
};

export type RawRePd = {
  readonly id: string;
  readonly content: string;
  readonly createdAt: Date;
  readonly userId: string;
  readonly pdId: string;
  readonly likeCount: number;
  readonly likes: RePdLike[];
};

export type RePdDetail = RawRePd & {
  readonly isMyRePd: boolean;
};

export type NewRePd = {
  readonly pdId: string;
  readonly content: string;
  readonly userId: string;
  readonly createdAt: Date;
};

export type PdLike = {
  readonly userId: string;
};

export type RawPd = {
  readonly id: string;
  readonly content: string;
  readonly createdAt: Date;
  readonly userId: string;
  readonly imageFileName: string | null;
  readonly likeCount: number;
  readonly replyCount: number;
  readonly likes: PdLike[];
};

export type PdPage = {
  readonly items: RawPd[];
  readonly nextCursor: string | undefined;
};

export type PdDetail = RawPd & {
  readonly isMyPd: boolean;
};

export type PdDetailPage = {
  readonly items: PdDetail[];
  readonly nextCursor: string | undefined;
};

export type NewPd = {
  readonly content: string;
  readonly userId: string;
  readonly createdAt: Date;
  readonly imageFileName: string | null;
};

export type 集計期間 = {
  readonly start: Date;
  readonly end: Date;
};

export type 日次集計 = {
  readonly 集計日: string;
  readonly count: number;
};

export type 投稿者別集計 = {
  readonly userId: string;
  readonly value: number;
};

export type 日毎の集計 = {
  readonly 日毎のPD数: 日次集計[];
  readonly 日毎のRePD数: 日次集計[];
  readonly 日毎のいいね数: 日次集計[];
};

export type 投稿者別集計群 = {
  readonly ユーザーごとのPD数: 投稿者別集計[];
  readonly ユーザーごとのいいね数: 投稿者別集計[];
  readonly ユーザーごとのRePD数: 投稿者別集計[];
};

export type 週間ランキング行 = {
  readonly userId: string;
  readonly pdCount: number;
  readonly rePdCount: number;
  readonly likeCount: number;
};

export type 週間統計 = {
  readonly range: {
    readonly start: string;
    readonly end: string;
  };
  readonly totals: {
    readonly pdCount: number;
    readonly rePdCount: number;
    readonly likeCount: number;
    readonly activeAuthorCount: number;
    readonly averagePdPerAuthor: number;
  };
  readonly daily: {
    readonly date: string;
    readonly pdCount: number;
    readonly rePdCount: number;
    readonly likeCount: number;
  }[];
  readonly rankings: 週間ランキング行[];
};

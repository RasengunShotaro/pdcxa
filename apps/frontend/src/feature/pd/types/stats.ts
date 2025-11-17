export type PdWeeklyStats = {
  range: {
    start: string;
    end: string;
  };
  totals: {
    pdCount: number;
    rePdCount: number;
    likeCount: number;
    activeAuthorCount: number;
    averagePdPerAuthor: number;
  };
  daily: {
    date: string;
    pdCount: number;
    rePdCount: number;
    likeCount: number;
  }[];
  rankings: PdRanking[];
};

type PdRanking = {
  userId: string;
  pdCount: number;
  rePdCount: number;
  likeCount: number;
};

type PdRankingWithUser = PdRanking & {
  displayName: string;
  userName: string;
  imageUrl: string;
};

export type PdWeeklyStatsDetailed = Omit<PdWeeklyStats, "rankings"> & {
  rankings: PdRankingWithUser[];
};

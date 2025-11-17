export type PD週間統計 = {
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
  rankings: {
    userId: string;
    pdCount: number;
    rePdCount: number;
    likeCount: number;
  }[];
};

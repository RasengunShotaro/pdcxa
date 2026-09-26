export type UserDetail = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string;
  userName: string | null;
};

export type RawQuotedPd = {
  id: string;
  content: string;
  createdAt: string;
  userId: string;
};

export type RawPd = {
  id: string;
  content: string;
  createdAt: string;
  userId: string;
  likeCount: number;
  replyCount: number;
  likes: { userId: string }[];
  isMyPd: boolean;
  isBookmarked: boolean;
  imageFileName: string | null;
  quotedPd: RawQuotedPd | null;
  quoteCount: number;
};

export type QuotedPd = RawQuotedPd & {
  userDetail: {
    userFullName: string;
    imageUrl: string;
    userName: string;
  };
};

export type LikeUser = {
  userId: string;
  userFullName: string;
  imageUrl: string;
  userName: string;
};

export type Pd = Omit<RawPd, "quotedPd"> & {
  quotedPd: QuotedPd | null;
  userDetail: {
    id: string;
    userFullName: string;
    imageUrl: string;
    userName: string;
  };
  likeUserNames: string[];
  likeUsers: LikeUser[];
};

export type RawRePd = {
  id: string;
  pdId: string;
  content: string;
  createdAt: string;
  userId: string;
  likeCount: number;
  likes: { userId: string }[];
  isMyRePd: boolean;
};

export type RePd = RawRePd & {
  userDetail: {
    id: string;
    userFullName: string;
    imageUrl: string;
    userName: string;
  };
  likeUserNames: string[];
  likeUsers: LikeUser[];
};

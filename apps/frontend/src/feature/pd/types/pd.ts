export type UserDetail = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string;
  userName: string | null;
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
  imageFileName: string | null;
};

export type LikeUser = {
  userId: string;
  userFullName: string;
  imageUrl: string;
  userName: string;
};

export type Pd = RawPd & {
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

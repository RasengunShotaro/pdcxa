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

export type Pd = RawPd & {
  userDetail: {
    id: string;
    userFullName: string;
    imageUrl: string;
    userName: string;
  };
  likeUserNames: string[];
};

export type RePd = {
  id: string;
  pdId: string;
  content: string;
  createdAt: string;
  userId: string;
  likeCount: number;
  likes: { userId: string }[];
  isMyRePd: boolean;
  userDetail: {
    id: string;
    userFullName: string;
    imageUrl: string;
    userName: string;
  };
  likeUserNames: string[];
};

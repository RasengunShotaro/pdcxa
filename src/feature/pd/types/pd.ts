export type Pd = {
  id: string;
  content: string;
  createdAt: Date;
  userId: string;
  likeCount: number;
  replyCount: number;
  likes: { userId: string }[];
  isMyPd: boolean;
  imageFileName: string | null;
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
  createdAt: Date;
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

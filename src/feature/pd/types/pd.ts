import type { Like } from "./like";

export type Pd = {
  id: string;
  content: string;
  createdAt: Date;
  userId: string;
  likes: Like[];
};

export type RePd = {
  id: string;
  pdId: string;
  content: string;
  createdAt: Date;
  userId: string;
  likes: Like[];
};

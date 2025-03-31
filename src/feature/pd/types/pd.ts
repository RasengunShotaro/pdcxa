import type { Like } from "./like";
import type { User } from "./user";

export type Pd = {
  id: string;
  content: string;
  createdAt: Date;
  user: User;
  rePds: RePd[];
  likes: Like[];
};

export type RePd = {
  id: string;
  pdId: string;
  content: string;
  createdAt: Date;
  user: User;
  likes: Like[];
};

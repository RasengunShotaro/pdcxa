import type { User } from "./user";

export type Like = {
  userId: string;
  pdId: string;
  createdAt: Date;
  user: User;
};

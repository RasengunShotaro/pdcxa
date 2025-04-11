"use server";

import { 拡張fetch } from "@/utils/fetch";

type UserFetch結果 = {
  first_name: string;
  last_name: string;
  image_url: string;
  username: string;
};

export const fetchUserDetail = async (userId: string) => {
  const response = await 拡張fetch<UserFetch結果>(
    `https://api.clerk.com/v1/users/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response;
};

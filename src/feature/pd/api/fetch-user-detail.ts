"use server";

import { clerkClient } from "@/lib/clerk";
import { cache } from "react";

export const fetchUserDetail = cache(async (userId: string) => {
  const result = (await clerkClient.users.getUser(userId)).raw;

  return {
    id: result?.id,
    first_name: result?.first_name,
    last_name: result?.last_name,
    image_url: result?.image_url,
    username: result?.username,
  };
});

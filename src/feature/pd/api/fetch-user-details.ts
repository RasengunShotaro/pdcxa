"use server";

import { clerkClient } from "@/lib/clerk";
import { cache } from "react";

export const fetchUserDetails = cache(async (userIds: string[]) => {
  const limit = userIds.length < 500 ? userIds.length : 500;
  const result = (
    await clerkClient.users.getUserList({
      userId: userIds,
      limit,
    })
  ).data;

  const userDetails = result.map((user) => {
    return {
      id: user.id,
      first_name: user.firstName,
      last_name: user.lastName,
      image_url: user.imageUrl,
      username: user.username,
    };
  });

  return userDetails;
});

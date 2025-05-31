"use server";

import { clerkClient } from "@/lib/clerk";
import { cache } from "react";

export const userNameToId = cache(async (userName: string) => {
  const result = (await clerkClient.users.getUserList({ username: [userName] }))
    .data[0];

  return {
    id: result?.id,
    firstName: result?.firstName,
    lastName: result?.lastName,
    imageUrl: result?.imageUrl,
    userName: result?.username,
  };
});

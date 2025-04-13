"use server";

import { clerkClient } from "@/lib/clerk";

export const createInvitation = async (email: string) => {
  const result = await clerkClient.invitations.createInvitation({
    emailAddress: email,
    ignoreExisting: true,
  });
  return result.raw;
};

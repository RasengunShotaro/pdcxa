"use server";

import { clerkClient } from "@/lib/clerk";
import { actionClient } from "@/lib/safe-action";
import { invitationFormSchema } from "./types";

export const createInvitation = actionClient
  .inputSchema(invitationFormSchema)
  .action(async ({ parsedInput: { mail } }) => {
    const result = await clerkClient.invitations.createInvitation({
      emailAddress: mail,
      ignoreExisting: true,
    });
    return result.raw;
  });

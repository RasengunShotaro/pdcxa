"use server";

import { getClient } from "@/lib/hono";
import { actionClient } from "@/lib/safe-action";
import { invitationFormSchema } from "./types";

export const createInvitation = actionClient
  .inputSchema(invitationFormSchema)
  .action(async ({ parsedInput: { mail } }) => {
    const client = await getClient();
    const res = await client.invitation.create.$post({
      json: {
        emailAddress: mail,
      },
    });

    return res;
  });

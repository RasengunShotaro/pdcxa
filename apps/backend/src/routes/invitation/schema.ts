import { z } from "@hono/zod-openapi";

export const createInvitationSchema = z.object({
  emailAddress: z.string().openapi({ example: "invitee@example.com" }),
});

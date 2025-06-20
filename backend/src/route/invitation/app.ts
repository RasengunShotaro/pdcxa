import { vValidator } from "@hono/valibot-validator";
import { Hono } from "hono";
import * as v from "valibot";

const invitationAppSchema = v.object({
  emailAddress: v.string(),
});

export const invitationApp = new Hono().post(
  "/create",
  vValidator("json", invitationAppSchema),
  async (c) => {
    const clerkClient = c.get("clerk");

    const body = c.req.valid("json");
    await clerkClient.invitations.createInvitation({
      emailAddress: body.emailAddress,
      ignoreExisting: true,
    });

    return c.json(
      {
        message: "招待を作成しました",
      },
      200
    );
  }
);

import { vValidator } from "@hono/valibot-validator";
import { Hono } from "hono";
import * as v from "valibot";

const userAppSchema = v.object({
  userName: v.string(),
});

export const userApp = new Hono().get(
  "/detail",
  vValidator("query", userAppSchema),
  async (c) => {
    const clerkClient = c.get("clerk");

    const body = c.req.valid("query");
    const userDetail = (
      await clerkClient.users.getUserList({ username: [body.userName] })
    ).data[0];

    return c.json(
      {
        id: userDetail.id,
        firstName: userDetail.firstName,
        lastName: userDetail.lastName,
        imageUrl: userDetail.imageUrl,
        userName: userDetail.username,
      },
      200
    );
  }
);

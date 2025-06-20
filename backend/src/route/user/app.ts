import { vValidator } from "@hono/valibot-validator";
import { Hono } from "hono";
import * as v from "valibot";

const userDetailSchema = v.object({
  userName: v.string(),
});
const userDetailsSchema = v.object({
  userIds: v.array(v.string()),
});

export const userApp = new Hono()
  .get("/detail", vValidator("query", userDetailSchema), async (c) => {
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
  })
  .get("/details", vValidator("query", userDetailsSchema), async (c) => {
    const clerkClient = c.get("clerk");

    const body = c.req.valid("query");
    const limit = body.userIds.length < 500 ? body.userIds.length : 500;
    const result = (
      await clerkClient.users.getUserList({
        userId: body.userIds,
        limit,
      })
    ).data;

    const userDetails = result.map((user) => {
      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
        userName: user.username,
      };
    });

    return c.json(userDetails, 200);
  });

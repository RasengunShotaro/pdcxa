import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { jsonContent, messageSchema } from "../common/openapi";
import { createInvitationSchema } from "./schema";

const createInvitationRoute = createRoute({
  operationId: "createInvitation",
  method: "post",
  path: "/create",
  request: {
    body: {
      content: { "application/json": { schema: createInvitationSchema } },
    },
  },
  responses: {
    200: jsonContent(messageSchema("招待を作成しました"), "作成成功"),
  },
});

export const invitationApp = new OpenAPIHono().openapi(
  createInvitationRoute,
  async (c) => {
    const clerkClient = c.get("clerk");

    const { emailAddress } = c.req.valid("json");
    await clerkClient.invitations.createInvitation({
      emailAddress,
      ignoreExisting: true,
    });

    return c.json({ message: "招待を作成しました" }, 200);
  },
);

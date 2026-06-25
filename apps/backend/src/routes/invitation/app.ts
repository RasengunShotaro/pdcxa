import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { Effect } from "effect";
import { ClerkClientPort } from "#/domain/clerk/client";
import { InvitationService } from "#/domain/invitation/service";
import { runtime } from "#/infrastructure/runtime";
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
    const { emailAddress } = c.req.valid("json");

    return runtime.runPromise(
      Effect.gen(function* () {
        const service = yield* InvitationService;
        yield* service.招待を作成する(emailAddress);
      }).pipe(
        Effect.map(() => c.json({ message: "招待を作成しました" }, 200)),
        Effect.tapError((error) => Effect.logError(error.message)),
        Effect.provideService(ClerkClientPort, c.get("clerk")),
      ),
    );
  },
);

import { Effect, Layer } from "effect";
import { ClerkClientPort } from "#/domain/clerk/client";
import { InvitationService } from "#/domain/invitation/service";
import { toClerkError } from "../error-mapping";

export const InvitationServiceLive = Layer.succeed(InvitationService, {
  招待を作成する: (emailAddress) =>
    Effect.gen(function* () {
      const clerk = yield* ClerkClientPort;
      yield* Effect.tryPromise({
        try: () =>
          clerk.invitations.createInvitation({
            emailAddress,
            ignoreExisting: true,
          }),
        catch: toClerkError,
      });
    }),
});

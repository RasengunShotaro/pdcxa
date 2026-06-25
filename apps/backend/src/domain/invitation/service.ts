import { Context, type Effect } from "effect";
import type { ClerkClientPort } from "../clerk/client";
import type { ClerkError } from "../errors";

export class InvitationService extends Context.Tag("InvitationService")<
  InvitationService,
  {
    readonly 招待を作成する: (
      emailAddress: string,
    ) => Effect.Effect<void, ClerkError, ClerkClientPort>;
  }
>() {}

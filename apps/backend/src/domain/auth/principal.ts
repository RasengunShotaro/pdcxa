import { Context } from "effect";

export type Principal = {
  readonly userId: string;
};

export class AuthContext extends Context.Service<AuthContext, Principal>()(
  "AuthContext",
) {}

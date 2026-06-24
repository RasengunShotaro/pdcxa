import { Context, type Effect } from "effect";
import type { ClerkClientPort } from "../clerk/client";
import type { ClerkError, UserNotFoundError } from "../errors";

export type UserDetail = {
  readonly id: string;
  readonly firstName: string | null;
  readonly lastName: string | null;
  readonly imageUrl: string;
  readonly userName: string | null;
};

export class UserDirectory extends Context.Tag("UserDirectory")<
  UserDirectory,
  {
    readonly ユーザー名で取得する: (
      userName: string,
    ) => Effect.Effect<
      UserDetail,
      ClerkError | UserNotFoundError,
      ClerkClientPort
    >;
    readonly ユーザーID一覧で取得する: (
      userIds: readonly string[],
    ) => Effect.Effect<UserDetail[], ClerkError, ClerkClientPort>;
  }
>() {}

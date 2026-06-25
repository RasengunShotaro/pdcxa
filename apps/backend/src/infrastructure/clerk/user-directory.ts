import type { User } from "@clerk/backend";
import { Effect, Layer } from "effect";
import { ClerkClientPort } from "#/domain/clerk/client";
import { UserNotFoundError } from "#/domain/errors";
import { type UserDetail, UserDirectory } from "#/domain/user/service";
import { toClerkError } from "../error-mapping";

const toUserDetail = (user: User): UserDetail => ({
  id: user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  imageUrl: user.imageUrl,
  userName: user.username,
});

export const UserDirectoryLive = Layer.succeed(UserDirectory, {
  ユーザー名で取得する: (userName) =>
    Effect.gen(function* () {
      const clerk = yield* ClerkClientPort;
      const list = yield* Effect.tryPromise({
        try: () => clerk.users.getUserList({ username: [userName] }),
        catch: toClerkError,
      });

      const raw = list.data[0];
      if (!raw) {
        return yield* Effect.fail(new UserNotFoundError({ userName }));
      }

      return toUserDetail(raw);
    }),

  ユーザーID一覧で取得する: (userIds) =>
    Effect.gen(function* () {
      const clerk = yield* ClerkClientPort;
      const limit = userIds.length < 500 ? userIds.length : 500;

      const list = yield* Effect.tryPromise({
        try: () => clerk.users.getUserList({ userId: [...userIds], limit }),
        catch: toClerkError,
      });

      return list.data.map(toUserDetail);
    }),
});

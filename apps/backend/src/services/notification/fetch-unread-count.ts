import { Effect } from "effect";
import { AuthContext } from "#/domain/auth/principal";
import { NotificationRepository } from "#/domain/notification/repository";

export const 通知の未読件数を取得する = () =>
  Effect.gen(function* () {
    const repo = yield* NotificationRepository;
    const { userId } = yield* AuthContext;

    const lastSeenAt = yield* repo.既読時刻を取得する(userId);
    if (lastSeenAt === null) {
      return { count: 0 };
    }

    const count = yield* repo.未読件数を取得する({ userId, lastSeenAt });
    return { count };
  });

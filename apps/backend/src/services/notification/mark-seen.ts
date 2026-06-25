import { Effect } from "effect";
import { AuthContext } from "#/domain/auth/principal";
import { NotificationRepository } from "#/domain/notification/repository";

export const 通知を既読にする = ({ seenAt }: { readonly seenAt: Date }) =>
  Effect.gen(function* () {
    const repo = yield* NotificationRepository;
    const { userId } = yield* AuthContext;
    yield* repo.既読にする({ userId, seenAt });
  });

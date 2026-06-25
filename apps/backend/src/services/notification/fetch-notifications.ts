import { Effect } from "effect";
import { AuthContext } from "#/domain/auth/principal";
import { NotificationRepository } from "#/domain/notification/repository";
import type {
  Notification,
  RawNotification,
} from "#/domain/notification/types";
import { type UserDetail, UserDirectory } from "#/domain/user/service";

const 不明な行為者 = (userId: string): UserDetail => ({
  id: userId,
  firstName: null,
  lastName: null,
  imageUrl: "",
  userName: null,
});

export const 通知に行為者を紐付ける = (
  items: readonly RawNotification[],
  actors: readonly UserDetail[],
): Notification[] => {
  const actorMap = new Map(actors.map((actor) => [actor.id, actor]));
  return items.map((item) => ({
    ...item,
    actor: actorMap.get(item.actorUserId) ?? 不明な行為者(item.actorUserId),
  }));
};

export const 通知一覧を取得する = ({ cursor }: { readonly cursor?: string }) =>
  Effect.gen(function* () {
    const repo = yield* NotificationRepository;
    const directory = yield* UserDirectory;
    const { userId } = yield* AuthContext;

    const page = yield* repo.一覧を取得する({ userId, cursor });

    const actorIds = [...new Set(page.items.map((item) => item.actorUserId))];
    const actors =
      actorIds.length > 0
        ? yield* directory.ユーザーID一覧で取得する(actorIds)
        : [];

    return {
      items: 通知に行為者を紐付ける(page.items, actors),
      nextCursor: page.nextCursor,
    };
  });

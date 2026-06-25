import { Effect } from "effect";
import { AuthContext } from "#/domain/auth/principal";
import { PdRepository } from "#/domain/pd/repository";
import type { PdDetail, RawPd } from "#/domain/pd/types";
import { UserDirectory } from "#/domain/user/service";

const isMyPdを付与する = (
  items: readonly RawPd[],
  currentUserId: string,
): PdDetail[] =>
  items.map((item) => ({ ...item, isMyPd: item.userId === currentUserId }));

export const PD一覧を取得する = ({
  pdId,
  userName,
  cursor,
}: {
  readonly pdId?: string;
  readonly userName?: string;
  readonly cursor?: string;
}) =>
  Effect.gen(function* () {
    const repo = yield* PdRepository;
    const { userId: currentUserId } = yield* AuthContext;

    if (pdId) {
      const items = yield* repo.IDで取得する(pdId);
      return {
        items: isMyPdを付与する(items, currentUserId),
        nextCursor: undefined as string | undefined,
      };
    }

    const directory = yield* UserDirectory;
    const userId = userName
      ? (yield* directory.ユーザー名で取得する(userName)).id
      : undefined;

    const page = yield* repo.一覧を取得する({ userId, cursor });
    return {
      items: isMyPdを付与する(page.items, currentUserId),
      nextCursor: page.nextCursor,
    };
  });

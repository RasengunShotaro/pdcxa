import { Effect } from "effect";
import { AuthContext } from "#/domain/auth/principal";
import { PdRepository } from "#/domain/pd/repository";
import type { PdDetail, RawPd } from "#/domain/pd/types";
import { UserDirectory } from "#/domain/user/service";

export const 閲覧者から見た状態を付与する = ({
  items,
  currentUserId,
  bookmarkedPdIds,
}: {
  readonly items: readonly RawPd[];
  readonly currentUserId: string;
  readonly bookmarkedPdIds: readonly string[];
}): PdDetail[] => {
  const bookmarked = new Set(bookmarkedPdIds);
  return items.map((item) => ({
    ...item,
    isMyPd: item.userId === currentUserId,
    isBookmarked: bookmarked.has(item.id),
  }));
};

export const 閲覧者から見たPD一覧にする = (items: readonly RawPd[]) =>
  Effect.gen(function* () {
    const repo = yield* PdRepository;
    const { userId: currentUserId } = yield* AuthContext;
    const bookmarkedPdIds = yield* repo.ブックマーク済みのPDIDを絞り込む({
      userId: currentUserId,
      pdIds: items.map((item) => item.id),
    });
    return 閲覧者から見た状態を付与する({
      items,
      currentUserId,
      bookmarkedPdIds,
    });
  });

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

    if (pdId) {
      const items = yield* repo.IDで取得する(pdId);
      return {
        items: yield* 閲覧者から見たPD一覧にする(items),
        nextCursor: undefined as string | undefined,
      };
    }

    const directory = yield* UserDirectory;
    const userId = userName
      ? (yield* directory.ユーザー名で取得する(userName)).id
      : undefined;

    const page = yield* repo.一覧を取得する({ userId, cursor });
    return {
      items: yield* 閲覧者から見たPD一覧にする(page.items),
      nextCursor: page.nextCursor,
    };
  });

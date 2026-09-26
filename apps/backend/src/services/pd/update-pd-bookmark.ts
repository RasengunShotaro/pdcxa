import { Effect } from "effect";
import { AuthContext } from "#/domain/auth/principal";
import { PdRepository } from "#/domain/pd/repository";

export const PDのブックマーク状態を更新する = ({
  pdId,
  bookmarked,
}: {
  readonly pdId: string;
  readonly bookmarked: boolean;
}) =>
  Effect.gen(function* () {
    const repo = yield* PdRepository;
    const { userId } = yield* AuthContext;
    yield* repo.ブックマーク状態を設定する({ pdId, userId, bookmarked });
  });

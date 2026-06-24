import { Effect } from "effect";
import { AuthContext } from "#/domain/auth/principal";
import { PdRepository } from "#/domain/pd/repository";

export const PDのいいね状態を更新する = ({ pdId }: { readonly pdId: string }) =>
  Effect.gen(function* () {
    const repo = yield* PdRepository;
    const { userId } = yield* AuthContext;
    yield* repo.いいねをトグルする({ pdId, userId });
  });

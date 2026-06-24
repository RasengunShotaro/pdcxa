import { Effect } from "effect";
import { AuthContext } from "#/domain/auth/principal";
import { RePdRepository } from "#/domain/repd/repository";

export const RePDのいいね状態を更新する = ({
  rePdId,
}: {
  readonly rePdId: string;
}) =>
  Effect.gen(function* () {
    const repo = yield* RePdRepository;
    const { userId } = yield* AuthContext;
    yield* repo.いいねをトグルする({ rePdId, userId });
  });

import { DateTime, Effect } from "effect";
import { AuthContext } from "#/domain/auth/principal";
import { RePdRepository } from "#/domain/repd/repository";

export const RePDを作成する = ({
  pdId,
  content,
}: {
  readonly pdId: string;
  readonly content: string;
}) =>
  Effect.gen(function* () {
    const repo = yield* RePdRepository;
    const { userId } = yield* AuthContext;
    const createdAt = yield* DateTime.nowAsDate;
    yield* repo.作成する({
      pdId,
      content,
      userId,
      createdAt,
    });
  });

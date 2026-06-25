import { Effect } from "effect";
import { AuthContext } from "#/domain/auth/principal";
import { RePdRepository } from "#/domain/repd/repository";
import type { RawRePd, RePdDetail } from "#/domain/repd/types";

const isMyRePdを付与する = (
  items: readonly RawRePd[],
  currentUserId: string,
): RePdDetail[] =>
  items.map((item) => ({ ...item, isMyRePd: item.userId === currentUserId }));

export const RePD一覧を取得する = ({ pdId }: { readonly pdId: string }) =>
  Effect.gen(function* () {
    const repo = yield* RePdRepository;
    const { userId } = yield* AuthContext;
    const items = yield* repo.PD配下を取得する(pdId);
    return isMyRePdを付与する(items, userId);
  });

import { Effect } from "effect";
import { QuotedPdNotFoundError } from "#/domain/errors";
import { PdRepository } from "#/domain/pd/repository";

export const 引用元のPDを確かめる = (quotedPdId: string | undefined) =>
  Effect.gen(function* () {
    if (!quotedPdId) {
      return null;
    }
    const repo = yield* PdRepository;
    const found = yield* repo.IDで取得する(quotedPdId);
    if (found.length === 0) {
      return yield* Effect.fail(new QuotedPdNotFoundError({ quotedPdId }));
    }
    return quotedPdId;
  });

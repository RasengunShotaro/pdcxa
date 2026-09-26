import { Effect } from "effect";
import { AuthContext } from "#/domain/auth/principal";
import { PdRepository } from "#/domain/pd/repository";
import { 閲覧者から見たPD一覧にする } from "./fetch-pds";

export const ブックマークしたPD一覧を取得する = ({
  cursor,
}: {
  readonly cursor?: string;
}) =>
  Effect.gen(function* () {
    const repo = yield* PdRepository;
    const { userId } = yield* AuthContext;

    const page = yield* repo.ブックマークしたPD一覧を取得する({
      userId,
      cursor,
    });
    return {
      items: yield* 閲覧者から見たPD一覧にする(page.items),
      nextCursor: page.nextCursor,
    };
  });

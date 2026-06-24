import { Context, type Effect } from "effect";
import type { DatabaseError } from "../errors";
import type { NewRePd, RawRePd } from "./types";

export class RePdRepository extends Context.Tag("RePdRepository")<
  RePdRepository,
  {
    readonly PD配下を取得する: (
      pdId: string,
    ) => Effect.Effect<RawRePd[], DatabaseError>;
    readonly 作成する: (newRePd: NewRePd) => Effect.Effect<void, DatabaseError>;
    readonly いいねをトグルする: (params: {
      readonly rePdId: string;
      readonly userId: string;
    }) => Effect.Effect<void, DatabaseError>;
  }
>() {}

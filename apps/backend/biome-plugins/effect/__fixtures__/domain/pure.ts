import { randomUUID } from "node:crypto";
import { Effect } from "effect";

declare const eff: Effect.Effect<number>;

export const g1 = Effect.gen(function* () {
  return yield* eff;
});
export const g2 = Effect.fn("domain.fn")(function* () {
  return yield* eff;
});
export const g3 = randomUUID();
export const g4 = crypto.randomUUID();
export const f1 = (): Date => new Date();
export const f2 = (): number => Date.now();

// Rule B (domain) + Rule C fixture。domain は Layer/provide/run/生IO 禁止・他層 import 禁止。
import { Effect, Layer } from "effect";
// rule C: domain → infra の import は禁止
import { Thing } from "../infrastructure/thing.ts";

declare const eff: Effect.Effect<number>;
declare const L: Layer.Layer<never>;

// --- banned (rule B) ---
export const b1 = Layer.succeed(Thing, 1);
export const b2 = Effect.provide(eff, L);
export const b3 = Effect.runPromise(eff);
export const b4 = Effect.tryPromise(() => Promise.resolve(1));
export const b5 = Effect.acquireRelease(eff, () => eff);

// --- allowed (発火してはいけない) ---
export const ok1 = Effect.gen(function* () {
  return yield* eff;
});
export const ok2 = Effect.fail("e");
export const ok3 = Effect.map(eff, (x) => x + 1);
export const ok4 = Effect.catchTag(eff, "Tag", () => eff);

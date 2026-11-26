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
export const b6 = (x: number): number => {
  if (x < 0) throw new Error("負値");
  return x;
};

// --- banned (rule G / rule A) ---
export const b7 = Effect.gen(function* () {
  return yield* eff;
});
export const b8 = Effect.fail("e");
export const b9 = Effect.acquireUseRelease(eff, () => eff, () => Effect.void);

// --- allowed (発火してはいけない) ---
export const ok3 = Effect.map(eff, (x) => x + 1);
export const ok4 = Effect.catchTag(eff, "Tag", () => eff);
export const ok5 = (x: number): number | null => (x < 0 ? null : x);

// Rule A fixture — 危険メソッドは全層で発火し、代替は発火しない。
// このファイルは layer ディレクトリ外なので rule A だけが対象。
import { Effect } from "effect";

declare const eff: Effect.Effect<number>;
declare const f: () => number;

// --- banned (rule A) ---
export const a1 = Effect.sync(f);
export const a2 = Effect.promise(() => Promise.resolve(1));
export const a3 = Effect.runSync(eff);
export const a4 = Effect.match(eff, { onFailure: () => 0, onSuccess: () => 1 });
export const a5 = Effect.catchIf(
  eff,
  () => true,
  () => eff,
);

// --- allowed alternatives (発火してはいけない) ---
export const ok1 = Effect.matchEffect(eff, {
  onFailure: () => eff,
  onSuccess: () => eff,
});
export const ok2 = Effect.matchCause(eff, {
  onFailure: () => 0,
  onSuccess: () => 1,
});
export const ok3 = Effect.catchTag(eff, "Tag", () => eff);
export const ok4 = Effect.runPromise(eff);

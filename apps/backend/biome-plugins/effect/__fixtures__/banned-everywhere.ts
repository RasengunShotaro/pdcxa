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
export const a6 = Effect.fail("時間切れ");
export const a7 = Effect.fail(new Error("上限を超えた"));
export const a8 = eff.pipe(Effect.catch(() => Effect.succeed(0)));
export const a9 = Effect.catch(eff, (_error) => Effect.succeed(0));
export const a10 = eff.pipe(Effect.catchCause(() => Effect.void));

// --- allowed alternatives (発火してはいけない) ---
export const ok5 = eff.pipe(
  Effect.catch((error) =>
    Effect.logWarning(`読めなかった: ${String(error)}`).pipe(Effect.as(0)),
  ),
);
export const ok6 = eff.pipe(Effect.catchTag("TimeoutError", () => eff));
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

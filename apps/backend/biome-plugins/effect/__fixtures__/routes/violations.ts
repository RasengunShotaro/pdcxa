// Rule D fixture。合成ルートで Layer.mergeAll(...) を provide すると発火。
// 単一の prebuilt layer の provide / run* は許可（合成ルートなので）。
import { Effect, Layer } from "effect";

declare const eff: Effect.Effect<number>;
declare const A: Layer.Layer<never>;
declare const B: Layer.Layer<never>;
declare const appLayer: Layer.Layer<never>;

// --- banned (rule D) ---
export const d1 = eff.pipe(Effect.provide(Layer.mergeAll(A, B)));
export const d2 = Effect.provide(eff, Layer.mergeAll(A, B));

// --- allowed in handler (発火してはいけない) ---
export const ok1 = eff.pipe(Effect.provide(appLayer));
export const ok2 = Effect.runPromise(eff);

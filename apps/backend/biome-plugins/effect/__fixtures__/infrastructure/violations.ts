// Rule B (infra) + Rule C fixture。infra は provide/run 禁止・service/route/handler import 禁止。
// Layer.*・生IO・Context.Tag は infra では許可。
import { Context, Effect, Layer } from "effect";
// rule C: infra → service の import は禁止
import { svc } from "../services/svc.ts";

declare const eff: Effect.Effect<number>;
declare const L: Layer.Layer<never>;

// --- banned (rule B infra: provide / run) ---
export const c1 = Effect.provide(eff, L);
export const c2 = Effect.runPromise(eff);

// --- allowed in infra (発火してはいけない) ---
export const ok1 = Layer.effect(svc, eff);
export const ok2 = Layer.provide(L, L);
export const ok3 = Effect.tryPromise(() => Promise.resolve(1));
export const ok4 = Effect.try(() => 1);
export class Client extends Context.Tag("Client")<
  Client,
  { readonly n: number }
>() {}

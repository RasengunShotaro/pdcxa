// Rule B (service) + Rule C fixture。service は Layer/provide/run/生IO 禁止・infra import 禁止。
import { Effect, Layer } from "effect";
// rule C: service → infra の import は禁止（依存は domain の Tag のみ）
import { repo } from "../infrastructure/repo.ts";

declare const eff: Effect.Effect<number>;
declare const f: () => number;

// --- banned (rule A: 層内でも発火する) ---
export const s0 = Effect.sync(f);

// --- banned (rule B) ---
export const s1 = Layer.succeed(repo, 1);
export const s2 = Effect.provideService(eff, repo, 1);
export const s3 = Effect.runFork(eff);
export const s4 = Effect.try(() => 1);

// --- allowed (発火してはいけない) ---
export const ok1 = Effect.gen(function* () {
  return yield* eff;
});
export const ok2 = Effect.flatMap(eff, () => eff);

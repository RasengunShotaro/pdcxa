// Rule E fixture — v4 で型が通っても挙動が変わる書き方。Rule E はテストファイルも対象にする。
import { Effect, type Result } from "effect";

declare const expect: (actual: unknown) => {
  toMatchObject: (expected: unknown) => void;
};

declare const eff: Effect.Effect<number>;
declare const result: Result.Result<number, string>;

// --- banned (rule E) ---
export const e1 = Effect.forkChild(eff);
export const e2 = Effect.die("呼ばれない");
export const e3 = Effect.die(`呼ばれない ${1}`);
expect(result).toMatchObject({ _tag: "Failure", failure: "x" });
expect({ result }).toMatchObject({ result: { _tag: "Success" } });

// --- allowed (発火してはいけない) ---
export const ok1 = Effect.forkChild(eff, { startImmediately: true });
export const ok2 = Effect.die(new Error("呼ばれない"));
export const ok3 = Effect.forkChild({ startImmediately: true });
expect(result).toMatchObject({ failure: "x" });
expect({ error: { _tag: "LLMError" } }).toMatchObject({
  error: { _tag: "LLMError" },
});

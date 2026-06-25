// domain の許可形だけ。1 件も発火してはいけない（false positive ガード）。
import { Context, Effect, type Layer, Schema } from "effect";
import { Other } from "./sibling.ts";

// Context.Tag による domain ポート定義は許可
export class Port extends Context.Tag("Port")<
  Port,
  { readonly read: () => Effect.Effect<number> }
>() {}

// Schema によるモデル定義は許可
export const Model = Schema.Struct({ id: Schema.String });

// 型注釈での Layer 参照は発火しない（型位置は member expression として拾わない）
export const describe = (l: Layer.Layer<never>): Layer.Layer<never> => l;

// Effect の合成・宣言は許可
export const ok1 = Effect.gen(function* () {
  return yield* Effect.succeed(1);
});
export const ok2 = Effect.fail("e");
export const reexport = Other;

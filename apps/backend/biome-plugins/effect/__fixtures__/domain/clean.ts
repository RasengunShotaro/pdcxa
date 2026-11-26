// domain の許可形だけ。1 件も発火してはいけない（false positive ガード）。
import { Context, Data, Effect, type Layer, Schema } from "effect";
import { Other } from "./sibling.ts";

class NotFound extends Data.TaggedError("NotFound")<{ readonly id: string }> {}

interface Entity {
  readonly status: "open" | "resolved";
  readonly createdAt: Date;
}

// Context.Service による domain ポート定義は許可
export class Port extends Context.Service<
  Port,
  { readonly read: () => Effect.Effect<number> }
>()("Port") {}

// Schema によるモデル定義は許可
export const Model = Schema.Struct({ id: Schema.String });

// 型注釈での Layer 参照は発火しない（型位置は member expression として拾わない）
export const describe = (l: Layer.Layer<never>): Layer.Layer<never> => l;

// 状態の意味を決める純関数・現在時刻を引数で受け取る純関数・Tagged Error の失敗は許可
export const ok1 = (entity: Entity): boolean => entity.status === "resolved";
export const ok2 = Effect.fail(new NotFound({ id: "x" }));
export const ok3 = ({ entity, now }: { entity: Entity; now: Date }): boolean =>
  now.getTime() - entity.createdAt.getTime() > 1000;
export const ok4 = new Date(0);
export const reexport = Other;

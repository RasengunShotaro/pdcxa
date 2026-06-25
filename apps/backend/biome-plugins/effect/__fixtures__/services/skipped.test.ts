// テスト除外ガード: *.test.ts は全ルールの対象外。ここの Effect.sync は発火してはいけない。
import { Effect } from "effect";

export const x = Effect.sync(() => 1);

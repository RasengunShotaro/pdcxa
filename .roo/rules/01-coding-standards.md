## コーディング規約

### 全体的

- テストファーストでの設計

### デザインルール

- 優先して shadcn-ui のコンポーネントを使用すること
  - shadcn-ui@latest は非推奨のため、shadcn@latest を使用すること
- 既存のデザインに調和するように、Tailwind CSS のユーティリティクラスを使用すること

### TypeScript

- 基本的には Biome のルールに従う
- let は使わないといけないときのみ。基本的には const を使う(厳守)
- Try ~ Catch は下位レイヤーで使わないこと。
  - 上位レイヤーでエラーをキャッチし、適切なエラーハンドリングを行うこと
- 型定義はできるだけ詳細に行うこと
- 各ファイルの冒頭にはコメントで仕様を記述する。
  - 出力例

```ts
/**
 * 2点間のユークリッド距離を計算する
 **/
type Point = { x: number; y: number };
export function distance(a: Point, b: Point): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}
```

- TypeScript で関数型ドメインモデリングを行う。class を使わず関数による実装を優先する。代数的データでドメインをモデリングする。
  - 出力例

```ts
type FetchResult<T, E> =
  | {
      ok: true;
      data: T;
    }
  | {
      ok: false;
      error: E;
    };
```

## テスト

- Vitest を採用(一部のコマンドは bun:test を使用)
- テスト名は振る舞いをベースとした言葉を使う。実装の詳細ではなく最終的に得られる結果であるべき。
- AAA パターンを用いる
- テストは{テスト対象ファイル名}.test.ts/tsx とし、テスト対象ファイルと同じディレクトリに配置。

```test command
bun test
```

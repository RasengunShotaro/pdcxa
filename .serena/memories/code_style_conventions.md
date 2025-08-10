# PDCXA コーディング規約・スタイル

## TypeScript規約

### 変数宣言
- **`const`優先**: 再代入が不要な場合は必ず`const`を使用
- **`let`は必要時のみ**: 再代入が必要な場合のみ`let`を使用
- **`var`使用禁止**: ES6以降の`const`/`let`を使用

### 関数定義
- **関数型プログラミング重視**: 純粋関数を優先
- **class使用禁止**: 関数コンポーネント・関数型アプローチを採用
- **Arrow Function推奨**: `const func = () => {}` 形式を基本とする

### 型定義
- **詳細な型記述**: any型は避け、具体的な型を定義
- **代数的データ型**: Union Types, Intersection Typesを活用
- **型ファイル**: `types/`ディレクトリまたは同階層に配置

## コードスタイル（Biome設定準拠）

### フォーマット
- **インデント**: スペース2つ
- **クォート**: ダブルクォート (`"`) を使用
- **セミコロン**: 必須
- **Import整理**: 自動整理ON（organizeImports）

### Lintルール
- **noForEach**: `forEach`使用エラー → `map`/`filter`推奨
- **noUnusedImports**: 未使用import自動削除
- **noUnusedVariables**: 未使用変数エラー
- **useAsConstAssertion**: `as const`推奨
- **useSelfClosingElements**: 自己閉じタグ強制

## コメント・ドキュメント

### ファイルヘッダー
```typescript
/**
 * PD作成機能のモーダルコンポーネント
 * - 画像アップロード機能
 * - フォームバリデーション
 * - 投稿処理
 */
```

### 関数コメント
- **仕様記述必須**: ファイル冒頭に機能・仕様を記述
- **複雑なロジック**: 必要に応じて処理の説明を追加

## 設計パターン

### React Components
```typescript
// Props型定義
interface ComponentProps {
  prop1: string;
  prop2?: number;
}

// 関数コンポーネント
const Component: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // hooks
  // handlers
  // render
  return <div>{prop1}</div>;
};
```

### カスタムフック
```typescript
const useCustomHook = ({ param }: { param: string }) => {
  // state
  // effects
  // handlers
  return { data, isLoading, error };
};
```

### API関数（バックエンド）
```typescript
/**
 * PDを作成する
 */
const createPd = async (input: CreatePdInput) => {
  // validation
  // business logic
  // database operation
  return result;
};
```

## 命名規則

### 変数・関数
- **camelCase**: 基本的な命名
- **日本語ドメイン用語**: `PDを作成する`, `いいね状態を更新する`
- **boolean**: `is/has`プレフィックス (`isLoading`, `hasError`)

### コンポーネント
- **PascalCase**: `PdModal`, `UserProfile`
- **機能名 + 種類**: `PdModal`, `PdList`, `PdCard`

### 型定義
- **PascalCase**: `UserDetail`, `PdFormSchema`
- **Props型**: `ComponentProps`形式

## ディレクトリ・ファイル命名
- **kebab-case**: `pd-modal.tsx`, `user-profile.tsx`
- **テストファイル**: `component.test.tsx`（同一ディレクトリ）

## エラーハンドリング
- **Try-Catch**: 上位レイヤーでのみ使用
- **下位レイヤー**: エラーを上位に伝播
- **型安全**: Result型やUnion Typesでエラー状態を表現

## テスト規約
- **AAA パターン**: Arrange-Act-Assert
- **振る舞いベーステスト名**: `should_create_pd_when_valid_input_provided`
- **テストファイル配置**: 対象ファイルと同一ディレクトリ
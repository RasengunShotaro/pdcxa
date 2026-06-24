---
paths:
  - "apps/frontend/**/*.ts"
  - "apps/frontend/**/*.tsx"
  - "apps/frontend/**/*.css"
---

# melta-ui Design System

このプロジェクトの UI は melta-ui DS に従う。SSOT は `melta-ui/` 以下（git submodule）。

## melta-ui とは何か（重要）

melta-ui は **コンポーネントライブラリではない**。React 実装は同梱しない。中身は：

- **デザイントークン**（カラー / 余白 / radius / etc. の SSOT 値）
- **クラス選択の規約**（セマンティック名で書く / 直値クラス禁止 / 等）
- **禁止パターン 89 件**（`border-t-4` カラーバー / `shadow-lg` 常用 / 等）
- **コンポーネント仕様の contract**（variant / size / a11y の機械可読仕様）

つまり **どのコンポーネント実装にも乗せられる規約レイヤー**。shadcn / MUI / 素の Tailwind、何で書いても出力された Tailwind クラスがこの規約に従えば OK。

## 必読（このルール発火時に自動ロード）

- @../../../melta-ui/DESIGN.md — 憲法 + Quick Reference（7原則 / カラー / クラス選択）
- @../../../melta-ui/foundations/theme.md — テーマ・CSS 変数定義

## 詳細仕様は MCP 経由で on-demand 取得

`.mcp.json` で `melta-ui` MCP サーバーが登録済み。以下のツールを必要な時だけ呼ぶ（毎回ファイルを Read しない）：

| ツール | 用途 |
|--------|------|
| `get_component` | 28 コンポーネント仕様（variant / size / a11y / Tailwind クラス） |
| `get_token` | 99 デザイントークン参照（例: `color.primary.500`） |
| `check_rule` | 89 禁止ルール中の自動検出可能サブセットで Tailwind クラスを検証 |
| `get_rules` | 89 ルール参照（manual 含む全件、category / severity / detector で filter 可） |
| `search` | 全文検索 |

リソース（参照のみ）: `melta://tokens` / `melta://components` / `melta://components/{id}` / `melta://rules`

## UI 生成フロー（必須）

1. **クラス選択**: DESIGN.md の Quick Reference に従う。曖昧なら `get_component` で contract を取得
2. **トークン参照**: `bg-primary-500` などセマンティック名を使う。`bg-blue-*` のような Tailwind 直値は使わない
3. **生成後の検証**: `check_rule` で禁止クラスの自動検出を実行し、違反があれば書き直す

## このプロジェクトでの適用面

- React 実装には **shadcn (radix-nova)** を使う（既存）
- melta-ui 規約は shadcn が出力する Tailwind クラスや CSS 変数の選び方に対して効く
- `globals.css` で melta-ui のトークン（`--primary-500..950` / `--bg-page` / `--text-default` 等）を定義済み。shadcn の `--primary` 等もこれにブリッジ済み
- 新規コンポーネントを書くときも、ライブラリ非依存のスタイル規約として melta-ui を参照する

## アップデート手順

```bash
git submodule update --remote melta-ui
cd melta-ui && npm install && npm run build  # MCP サーバー再ビルド
```

## 未対応（必要に応じて Phase 2）

- `npm run design:check` 相当の CI 検証（生成 PR で自動的に禁止クラスを reject）
- `check_rule` を PostToolUse hook に組み込んで生成直後にローカル検証

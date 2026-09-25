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

## 必読（このルール発火時に Read する）

- `melta-ui/DESIGN.md` — 憲法 + Quick Reference（7原則 / カラー / クラス選択）
- `melta-ui/foundations/theme.md` — テーマ・CSS 変数定義

`@` インポートで書かない。`paths:` は本文にしか効かず、`@` は全セッション常時ロードになる（backend の作業でも数万文字を払う）。

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

## Tailwind v4 の罠: `transition-[...]` に `transform` と書いても `translate-*` / `scale-*` は動かない

Tailwind v4 の `translate-x-*` / `-translate-y-*` / `scale-*` / `rotate-*` は、`transform` ではなく**同名の単独 CSS プロパティ**（`translate` / `scale` / `rotate`）を出力する。`transition-transform` **ユーティリティ**は `transform, translate, scale, rotate` の 4 つに展開されるが、**角括弧の中身は素の CSS プロパティ名としてそのまま出る**ので、`transition-[transform,box-shadow]` は `translate` を一切カバーしない。

```
NG: transition-[transform,box-shadow] hover:-translate-y-px   → 移動だけ 0ms で瞬間移動し、影だけ滑らかに付く
NG: transition-colors hover:-translate-y-px                   → 同上（colors に translate は含まれない）
OK: transition-transform hover:-translate-y-px                 → 4 プロパティに展開されるので動く
OK: transition-[translate,box-shadow] hover:-translate-y-px    → 実際に変化するプロパティを明示する
```

**症状が「アニメーションが急・効いていない」なので、easing や duration をいじる方向に迷い込みやすい**。hover の動きが硬いと感じたら、まず `getComputedStyle(el).transitionProperty` を実機で見て、`translate` / `scale` が入っているかを確認する。`transitionstart` イベントを張ると、どのプロパティが実際にトランジションしたかが一発で分かる。

react-doctor の `no-transition-all` を避けようとしてプロパティを手書きするときに最も踏みやすい。プロパティを列挙するなら、動かしている utility が出力する**実際のプロパティ名**を書く。

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

## 禁止クラスの自動検出

`bun run design:check`（`scripts/check-melta-rules.ts`）が `apps/frontend/src` 全ファイルの、`className` に限らない**全文字列リテラル**（cva / tv / 設定オブジェクトも対象）を melta-ui の自動検出ルールで検査する。PostToolUse hook（`.claude/hooks/check-melta-rules.mjs`）が frontend のファイルを編集したときに**同じスクリプト**を呼び、違反があれば編集を差し戻す。

- 検査はファイル単位でなく frontend 全体なので、既存違反が 1 件でも残るとどの編集でも止まる。違反は 0 件に保つ
- melta-ui submodule（`melta-ui/src`）を要求する。worktree で未初期化なら `git submodule update --init melta-ui`
- 検出器自体が死んだら気づけないので、スクリプトは毎回 planted violation の自己確認をしてから走る
- トークンのコントラスト検査（AA 4.5:1）は `globals.css` の値が HEX のときだけ効く。現在の pdcxa は oklch なので実質スキップされる

未対応: CI での `design:check` 実行

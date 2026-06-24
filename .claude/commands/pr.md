# PR作成（チェック付き）

変更内容に応じた検証を実行し、全て通過したらPRを作成します。

## 手順

### 1. 変更ファイルの特定

```bash
git fetch origin main
git diff origin/main --name-only
```

ローカル `main` は stale なことがあり、無関係ファイルが diff に混入する。必ず `origin/main` を基準にする。

変更されたファイルのパスから、以下のどの領域に変更があるかを判定する:
- **backend**: `apps/backend/` 配下のファイルが変更されている
- **frontend**: `apps/frontend/` 配下のファイルが変更されている

### 2. Backend チェック（backend変更がある場合のみ）

```bash
cd apps/backend

# Lint
bun run lint

# フォーマット
bun run format

# 型チェック
bun run typecheck

# テスト
bun run test
```

全て通過しない場合は修正してから再実行する。

### 3. Frontend チェック（frontend変更がある場合のみ）

```bash
cd apps/frontend

# Lint
bun run lint

# フォーマット
bun run format

# 型チェック
bun run typecheck

# テスト（unit + storybook play）
bun run test
bun run test:storybook --run

# React Doctor
bun run doctor
```

OpenAPI schema（backend の `app.openapi(...)` の zod）を変更した場合は API 契約を再生成してコミットする:

```bash
cd apps/frontend && bun run api:generate
```

全て通過しない場合は修正してから再実行する。

### 4. コードレビュー

ロジック変更を含む場合は、PR 作成前に `/code-review` を起動する（設定/ドキュメントのみの変更、レビュー済みの再投入はスキップ可）。AUTO_FIX は適用し、ESCALATE はユーザーに提示してから進む。

### 5. PR作成

全てのチェックが通過したら、PRを作成する。

- ベースブランチ: `main`
- 変更内容を分析して適切なタイトルと説明を作成
- `gh pr create` を使用

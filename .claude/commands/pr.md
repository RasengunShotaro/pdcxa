# PR作成（チェック付き）

変更内容に応じた検証を実行し、全て通過したらPRを作成します。

## 手順

### 1. 変更ファイルの特定

```bash
git diff dev --name-only
```

変更されたファイルのパスから、以下のどの領域に変更があるかを判定する:
- **backend**: `backend/` 配下のファイルが変更されている
- **frontend**: `frontend/` 配下のファイルが変更されている

### 2. Backend チェック（backend変更がある場合のみ）

```bash
cd backend/lambda

# Lint
bun run lint

# フォーマット
bun run format

# 型チェック（ビルド）
bun run typecheck
```

全て通過しない場合は修正してから再実行する。

### 3. Frontend チェック（frontend変更がある場合のみ）

```bash
cd frontend/react

# Lint
bun run lint

# フォーマット
bun run format

# 型チェック（ビルド）
bun run check-types
```

全て通過しない場合は修正してから再実行する。

### 5. PR作成

全てのチェックが通過したら、PRを作成する。

- ベースブランチ: `dev`
- 変更内容を分析して適切なタイトルと説明を作成
- `gh pr create` を使用

# PDCXA 開発用コマンド一覧

## 基本開発コマンド

### 環境セットアップ
```bash
# 依存関係インストール
bun install

# データベースマイグレーション（backendディレクトリで実行）
cd apps/backend
bun drizzle:push
```

### 開発サーバー
```bash
# 開発環境起動（フロント・バック同時起動）
bun dev

# フロントエンドのみ
cd apps/frontend && bun dev

# バックエンドのみ  
cd apps/backend && bun dev
```

### ビルド・デプロイ
```bash
# 全体ビルド
bun build

# 本番デプロイ
bun deploy

# 開発環境デプロイ
bun deploy:dev
```

## 品質管理コマンド

### 型チェック
```bash
# 全体の型チェック
bun check-types

# フロントエンドの型チェック
cd apps/frontend && bun check-types

# バックエンドの型チェック
cd apps/backend && bun check-types
```

### リント・フォーマット
```bash
# Biome linting
bun lint

# フロントエンドのNext.js lint
cd apps/frontend && bun lint
```

### テスト
```bash
# 全体テスト実行
bun test

# フロントエンドテスト
cd apps/frontend && bun test
```

## データベース関連

### Drizzle ORM (backendディレクトリで実行)
```bash
cd apps/backend

# マイグレーション生成
bun drizzle:generate

# マイグレーション適用
bun drizzle:push

# スキーマ内省
bun drizzle:introspect
```

## Cloudflare関連

### フロントエンド (apps/frontend)
```bash
cd apps/frontend

# Cloudflare環境の型定義生成
bun cf-typegen

# プレビュー
bun preview

# アップロード
bun upload
```

### バックエンド (apps/backend)
```bash
cd apps/backend

# Workers本番デプロイ
bun deploy

# Workers開発環境デプロイ  
bun deploy:dev

# TypeScriptビルド
bun build
```

## Git関連（推奨）
```bash
# ステータス確認
git status

# 変更差分確認  
git diff

# コミット
git add .
git commit -m "feat: 新機能追加"

# プッシュ
git push origin main
```

## システムコマンド（Linux）
```bash
# ファイル一覧
ls -la

# ディレクトリ移動
cd <directory>

# ファイル検索
find . -name "*.ts" -type f

# 文字列検索
grep -r "searchterm" ./src

# プロセス確認
ps aux | grep bun
```

## 開発フロー推奨コマンドセット

### 機能開発開始時
```bash
bun install          # 依存関係更新
bun check-types      # 型チェック
bun test            # テスト実行
bun dev             # 開発サーバー起動
```

### 開発完了時
```bash
bun check-types     # 型チェック
bun lint           # リント
bun test           # テスト
bun build          # ビルド確認
```
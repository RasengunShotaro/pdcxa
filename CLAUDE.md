# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

PDCXA は PD（チャット）とそのフィードバック（RePd：リプライ）を共有するプラットフォームです。モノレポ構成で、Cloudflare Pages（フロントエンド）、Cloudflare Workers（バックエンド）、Neon（データベース）を使用しています。

## 開発環境・技術スタック

- **パッケージマネージャ**: Bun
- **モノレポ管理**: Turbo
- **フロントエンド**: Next.js 15 App Router + React 19 + TypeScript
- **バックエンド**: Hono + Cloudflare Workers + TypeScript
- **データベース**: Neon PostgreSQL + Drizzle ORM
- **認証**: Clerk
- **UI**: Shadcn UI + Tailwind CSS
- **テスト**: Vitest
- **状態管理**: React Query
- **フォーム**: React Hook Form + Valibot
- **リンター**: Biome

## 重要なコマンド

```bash
# 開発環境起動（フロントエンド・バックエンド同時起動）
bun dev

# ビルド
bun build

# 型チェック
bun check-types

# テスト実行
bun test

# リント実行
bun lint

# データベースマイグレーション（backend ディレクトリで実行）
cd apps/backend
bun drizzle:push

# 本番デプロイ
bun deploy

# 開発環境デプロイ
bun deploy:dev
```

## アーキテクチャ

### ディレクトリ構造（Bulletproof React準拠）

- `apps/frontend/src/feature/` - 機能別のコンポーネント、hooks、API呼び出し、型定義
- `apps/frontend/src/components/` - 共通コンポーネント（ui/, elements/）
- `apps/backend/src/route/` - エンドポイント別のルーティング（pd/, repd/, user/, invitation/）
- `apps/backend/src/route/[domain]/utils/` - ドメインロジック実装

### ヘキサゴナルアーキテクチャ（バックエンド）

各ドメインは3層構造：
- `application/` - アプリケーション層
- `infrastructure/` - インフラ層
- `utils/` - ドメインロジック（現在はutilsディレクトリに配置）

### ドメイン用語

- **PD**: チャット投稿（Post Discussion）
- **RePd**: リプライ投稿（Reply to PD）

## コーディング規約

### TypeScript

- `const` 優先、`let` は必要時のみ
- 関数型プログラミング重視（class 使用禁止）
- 代数的データ型でドメインモデリング
- 型定義は詳細に記述
- ファイル冒頭にコメントで仕様記述必須
- Try-Catch は上位レイヤーのみ

### 設計原則

- テストファースト設計
- Biome ルール準拠
- Shadcn UI コンポーネント優先使用
- 既存デザインに調和した Tailwind CSS

### テスト

- Vitest 使用
- AAA パターン
- テストファイルは `{対象ファイル名}.test.ts/tsx` として同一ディレクトリに配置
- 振る舞いベースのテスト名

## データベース設計

主要テーブル：
- `pds` - PD投稿
- `repds` - RePd投稿
- `pd_likes` - PDいいね
- `repd_likes` - RePdいいね

## API設計

- Hono フレームワーク使用
- Valibot によるバリデーション
- 日本語ドメイン用語を関数名に使用（例：`PDを作成する`、`PDのいいね状態を更新する`）

## 重要な注意事項

- 機密情報（API キー、環境変数）の読み取り・PUSH 禁止
- ライブラリの勝手なアップデート禁止
- Shadcn UI は `shadcn@latest` を使用（`shadcn-ui@latest` は非推奨）
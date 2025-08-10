# PDCXA 技術スタックとアーキテクチャ

## 主要技術スタック

### フロントエンド (`apps/frontend`)
- **フレームワーク**: Next.js 15 (App Router)
- **ライブラリ**: React 19 + TypeScript
- **UI**: Shadcn UI + Tailwind CSS v4
- **状態管理**: React Query (@tanstack/react-query)
- **フォーム**: React Hook Form + Valibot
- **認証**: Clerk (@clerk/nextjs)
- **スタイリング**: Tailwind CSS + Radix UI
- **アニメーション**: Motion + tw-animate-css

### バックエンド (`apps/backend`)
- **フレームワーク**: Hono v4.8+
- **ランタイム**: Cloudflare Workers
- **データベース**: Neon PostgreSQL + Drizzle ORM v0.44+
- **認証**: Clerk + @hono/clerk-auth
- **画像処理**: wasm-image-optimization
- **バリデーション**: Valibot (standardValidator経由)

### 開発ツール
- **パッケージマネージャ**: Bun 1.2.17
- **モノレポ管理**: Turbo v2.5+
- **リンター・フォーマッター**: Biome
- **テスト**: Vitest
- **型チェック**: TypeScript 5

### インフラ・デプロイメント
- **フロントエンド**: Cloudflare Pages (@opennextjs/cloudflare)
- **バックエンド**: Cloudflare Workers (Wrangler)
- **データベース**: Neon PostgreSQL
- **画像ストレージ**: Cloudflare R2

## アーキテクチャパターン

### フロントエンド（Bulletproof React準拠）
```
apps/frontend/src/
├── app/                    # Next.js App Router
├── components/             # 共通コンポーネント
│   ├── ui/                # Shadcn UIコンポーネント
│   └── elements/          # カスタム共通コンポーネント
├── feature/               # 機能別ディレクトリ
│   ├── pd/               # PD関連機能
│   ├── profile/          # プロフィール機能
│   ├── invitation/       # 招待機能
│   └── signin/           # サインイン機能
├── hooks/                # カスタムフック
├── lib/                  # ライブラリ設定
└── utils/                # ユーティリティ関数
```

### バックエンド（ヘキサゴナル風）
```
apps/backend/src/
├── route/                # エンドポイント別ルーティング
│   ├── pd/              # PD関連API
│   ├── repd/            # RePd関連API
│   ├── user/            # ユーザー関連API
│   └── invitation/      # 招待関連API
├── db/                  # データベース関連
│   ├── schema.ts        # Drizzleスキーマ
│   └── migrations/      # マイグレーション
├── lib/                 # ライブラリ設定
└── utils/               # 共通ユーティリティ
```

## データベース設計
- **pds**: PD投稿テーブル
- **repds**: RePd投稿テーブル  
- **pdLikes**: PDいいねテーブル
- **rePdLikes**: RePdいいねテーブル

## 特徴的なアーキテクチャ要素
- **機能別ディレクトリ構成**: feature/[domain]で機能を分離
- **型安全なAPI通信**: HonoからのRPCクライアント
- **画像最適化**: WASM使用の軽量画像処理
- **フルスタックTypeScript**: フロント・バック共通の型定義
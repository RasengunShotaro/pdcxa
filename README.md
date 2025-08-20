# PDCXA

PDCXA は、PD に関する投稿とフィードバックを共有するプラットフォームです。

## 開発環境のセットアップ

Bun の仮想環境管理は [Proto](https://moonrepo.dev/proto) の利用を推奨([.prototools](./.prototools) にピン留め済み)

### 1. リポジトリのクローン

```bash
git clone https://github.com/RasengunShotaro/pdcxa.git
cd pdcxa
```

### 2. 依存関係のインストール

```bash
bun install
```

### 3. 環境変数の設定

以下の環境変数を設定してください：

```env
# Clerk認証
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key

# データベース
DATABASE_URL=your_neon_database_url

# ログインページのカスタムエンドポイント、リダイレクト先
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/signin
NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=/

# バックエンドのURL
BASE_URL=your_backend_url
```

### 4. データベースのマイグレーション

```bash
cd apps/backend
bun db:push
```

### 5. 開発サーバーの起動

```bash
bun dev
```

開発サーバーは http://localhost:3000 で起動します。

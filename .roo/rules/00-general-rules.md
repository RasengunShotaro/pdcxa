# 全体の規約

- 機密ファイル、環境変数、API キーなどの情報を含むファイルの読み取りや PUSH は禁止
- 勝手なライブラリのアップデートは禁止
- 開発していて問題だった箇所、全体プロンプトに追加したほうが良い箇所については、03-temporary.md に追記すること。(後で人間が適切に分別する)

## 開発環境(主要なもの)

- Next.JS 15 App Router
- TypeScript
- Tailwind CSS
- Shadcn UI
- Biome
- Clerk
- Drizzle
- Vitest
- React Query
- Bun

## デプロイ環境

- Neon(無料プラン)
- Cloudflare Pages(無料プラン)

# ディレクトリ構成

- 基本的には bulletproof-react のディレクトリ構成に従う
- 関数はヘキサゴナルアーキテクチャを採用。application, domain, infrastructure の 3 層に分ける

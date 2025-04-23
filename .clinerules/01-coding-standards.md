# 全体の規約

- 機密ファイル、環境変数、API キーなどの情報を含むファイルの読み取りや PUSH は禁止
- 勝手なライブラリのアップデートは禁止
- 開発していて問題だった箇所、全体プロンプトに追加したほうが良い箇所については、03-temporary.md に追記すること。(後で人間が適切に分別する)

## 開発環境

- Next.JS App Router
- TypeScript
- Tailwind CSS
- Shadcn UI
- Biome

## デプロイ環境

- Neon(無料プラン)
- Cloudflare(無料プラン)

# ディレクトリ構成

- 基本的には bulletproof-react のディレクトリ構成に従う
- 関数はヘキサゴナルアーキテクチャを採用。application, domain, infrastructure の 3 層に分ける

## コーディング規約

- 基本的には Biome のルールに従う
- let を使わず const を使う(厳守)
- shadcn-ui@latest は非推奨のため、shadcn@latest を使用すること
- 優先して shadcn-ui のコンポーネントを使用すること

## テスト

- Vitest を採用

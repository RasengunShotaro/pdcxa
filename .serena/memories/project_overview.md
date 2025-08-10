# PDCXA プロジェクト概要

## プロジェクトの目的
PDCXAは、PD（Post Discussion）に関する投稿とフィードバック（RePd）を共有するプラットフォームです。ユーザーが意見を投稿し、それに対するフィードバックを受け取ることができるコミュニティプラットフォームとして機能します。

## ドメイン用語
- **PD**: Post Discussion - メインの投稿・チャット
- **RePd**: Reply to PD - PDに対するリプライ・フィードバック

## プロジェクト構造
- **モノレポ構成**: Turboを使用したWorkspace管理
- **フロントエンド**: `apps/frontend` - Next.js 15 + React 19
- **バックエンド**: `apps/backend` - Hono + Cloudflare Workers
- **共通パッケージ**: `packages/` - 開発用共通依存関係

## 主要機能
- PD（投稿）の作成・表示・いいね機能
- RePd（リプライ）の作成・表示・いいね機能
- ユーザー認証（Clerk）
- 画像アップロード機能
- 招待システム

## デプロイメント環境
- **フロントエンド**: Cloudflare Pages
- **バックエンド**: Cloudflare Workers  
- **データベース**: Neon PostgreSQL
- **画像ストレージ**: Cloudflare R2

## 開発環境
- **パッケージマネージャ**: Bun 1.2.17
- **Node.jsバージョン管理**: Proto (.prototoolsでピン留め)
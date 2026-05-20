# Repository Guidelines

## Project Structure & Module Organization
- `apps/frontend`: Next.js 16 + React 19 の UI 層です。`src/app` にルーティング、`src/components` に再利用 UI、`src/feature` にドメイン単位のロジックをまとめます。`public/` は静的アセット、Cloudflare 連携は `wrangler.jsonc` と `open-next.config.ts` で管理します。
- `apps/backend`: Hono ベースの Cloudflare Workers API。`src/index.ts` がエントリ、`src/route` にエンドポイント、`src/db` と `drizzle/` がスキーマです。`dist/` はビルド生成物なので編集しません。
- `packages/common-dev-packages`: Lint 設定や共有ユーティリティを格納します。複数アプリで使う型・関数はまずここに追加し、semantic version を保ちます。
- ルート直下の `turbo.json` と `biome.json` がパイプラインとスタイルの単一情報源です。改定時は frontend/backend 双方でのキャッシュクリアを忘れないでください。

## Build, Test, and Development Commands
- `bun install`: mise が固定した Bun バージョンで依存を導入します。
- `bun run dev`: Turbo で全アプリの `dev` を並列起動します。個別には `cd apps/frontend && bun run dev` や `cd apps/backend && bun run dev` を使用します。
- `bun run build`: すべての `build` タスクを実行し、Cloudflare 用アーティファクト (`dist/`, `.open-next/`) を生成します。
- `bun run lint` / `bun run check-types`: Biome と TypeScript の静的検証をワークスペース全体に適用します。
- `bun run test`: Turbo 経由で各 `test` スクリプトを呼び出します。限定実行は `bun test src/feature/<domain>/<unit>.test.tsx` のように対象ディレクトリで行ってください。
- `cd apps/backend && bun drizzle:push`: Neon データベースへマイグレーションを反映します。実行前に `drizzle:generate` で差分を確認してください。

## Coding Style & Naming Conventions
- Biome でインデント 2 スペース、ダブルクォート、import 並び替えが強制されています。コミット前に `bun run lint` で自動修正を適用してください。
- TypeScript は strict モードです。React コンポーネントは `PascalCase.tsx`、hooks は `useXxx.ts`、ユーティリティは `camelCase` 命名を徹底します。
- API ルートや Drizzle スキーマには valibot/zod 等で型を明示し、`route/<domain>/<verb>.ts` や `db/schema/<table>.ts` のように用途を判別できるパスに配置します。
- コード内へのコメント記述は禁止です。意図や背景はコミットメッセージや PR 説明で共有し、ソースには挙動に必要な最小限の記述のみを残してください。

## Testing Guidelines
- ルートの `bun run test` は Turbo で集約されます。フロントエンドは Vitest + React Testing Library を想定し、`*.test.tsx` を `src/feature` 直下に置きます。hooks やユーティリティは `*.test.ts` でカバーしてください。
- バックエンドは Bun のテストランナーを利用し、`src/route/**/__tests__` などでリクエスト単位の成功・異常ケースを最低 2 本ずつ追加します。Clerk や Neon の依存はモック/スタブを準備してください。
- `bun run test -- --coverage` で差分カバレッジ 80% 以上を維持するのが目標です。データベースを触るテストは `wrangler.toml` ではなく `.env.test` で接続情報を差し替えます。

## Commit & Pull Request Guidelines
- Git ログでは絵文字 + ショートタグ (例: `🆙 chore: bump deps`) を先頭に付ける流儀です。`feat`, `fix`, `chore`, `docs` などの種別を明示し、50 文字以内の英語サマリを心掛けてください。
- Pull Request には目的、影響範囲、動作確認コマンド、環境変数の差分、関連 issue/Notion を箇条書きで記載します。UI 変更はキャプチャ、API 変更は cURL 例やリクエスト JSON を添えます。
- マイグレーションや依存更新を含む PR は `bun run build && bun run test` の結果スクリーンショットを添付し、レビュワーが再現できるようにします。

## Security & Configuration Tips
- 機密値は `.env.local` または `wrangler.jsonc` の `vars` に定義し、Git 管理ファイルへ直書きしないでください。README の環境変数一覧を最新化しつつ共有します。
- Cloudflare Workers / Neon 認証情報は環境ごとに分離し、`bun run deploy:dev` 実行前に `BASE_URL` と Clerk の URL が環境一致しているか確認してください。mise で Bun を更新した場合は `mise install` を再実行し、Wrangler の API トークン有効期限も併せて確認します。

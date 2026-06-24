# Development Workflow

> This file extends [common/git-workflow.md](./git-workflow.md) with the full feature development process that happens before git operations.

The Feature Implementation Workflow describes the development pipeline: research, planning, TDD, code review, and then committing to git.

## Feature Implementation Workflow

0. **Domain Understanding** _(最優先)_
   - ドメイン概念に触れる UI / 構造を作る前に、ドメイン文書があれば読む
   - 無ければユーザーに業務概念・依存関係・プロセス順序を聞く
   - UI のグループ化 / 並び順 / 優先度はドメインの依存方向に従う
   - **仕様の隙間を AI が発明した構造で埋めない**（理由: もっともらしい中間段階や一般論は、ドメインに根ざしておらず丸ごと棄却される）。推測した要素は stated（ユーザー/docs が明示したもの）と区別して明示し、ユーザー確認を取ってから実装する
   - **多重度を 1:1 と決め打たない**: エンティティ間の関連は「X は複数の Y を持ちうるか」(1:N) を確認してから設計する。モデル変更時は **波及先エンティティ**（同じ関連を持つ他モデル）への影響も surface する

1. **Research & Reuse** _(mandatory before any new implementation)_
   - **GitHub code search first:** Run `gh search repos` and `gh search code` to find existing implementations, templates, and patterns before writing anything new.
   - **Library docs second:** Use Context7 or primary vendor docs to confirm API behavior, package usage, and version-specific details before implementing.
   - **Exa only when the first two are insufficient:** Use Exa for broader web research or discovery after GitHub search and primary docs.
   - **Check package registries:** Search npm, PyPI, crates.io, and other registries before writing utility code. Prefer battle-tested libraries over hand-rolled solutions.
   - **Search for adaptable implementations:** Look for open-source projects that solve 80%+ of the problem and can be forked, ported, or wrapped.
   - Prefer adopting or porting a proven approach over writing net-new code when it meets the requirement.
   - **社内コードの既存 capability を先に確認:** 新しいデータ取得 (adapter / repository) や schema フィールドを足す前に、同じ情報源が既存層に無いか `rg` で確認する。新設する場合も「既存を再利用できない根拠」(取得経路が違う / 粒度が合わない 等) を持ってから着手する。

2. **Plan First**
   - Use **planner** agent to create implementation plan
   - Generate planning docs before coding: PRD, architecture, system_design, tech_doc, task_list
   - Identify dependencies and risks
   - Break down into phases

3. **TDD Approach**
   - Use **tdd-guide** agent
   - Write tests first (RED)
   - Implement to pass tests (GREEN)
   - Refactor (IMPROVE)
   - Verify 80%+ coverage

4. **Code Review** _(報告前に必ず)_
   - **コード実装が完了し、ユーザーへ完了報告する直前に `/code-review` skill を起動する** (`.claude/skills/code-review/SKILL.md`)
   - skill は Sonnet サブエージェントで `git diff` をレビューし、指摘を **テスト/実行で empirical 検証** してから返す
   - 検証済みの **AUTO_FIX** (判断の余地が無いもの) は即適用、**ESCALATE** (不可逆操作・コスト・契約変更・仕様解釈等で人間判断が要るもの) はユーザーに提示する
   - 設定/ドキュメントだけの変更や、レビュー済みの再投入はスキップ可

### Frontend / UI 完了報告前の必須チェックリスト

`/code-review` の前に、frontend/UI 変更では **下記すべて緑** になっていることを確認する。Storybook + typecheck だけで「完了」と報告するのは禁止。

- [ ] `bun run typecheck` (frontend / backend 両方)
- [ ] `bun run lint` (biome。import 整列・整形含む。落ちたら `biome check --write`)（理由: 報告前に通さないと CI lint で落ちる。typecheck / test だけでは検出されない）
- [ ] `bun run test` (unit + integration)
- [ ] `bun run test:storybook --run` (story の play function 含む)
- [ ] **OpenAPI schema を変えたら API 契約を再生成・コミット**: backend `app.openapi(...)` の zod schema を変更したら `cd apps/frontend && bun run api:generate` で `apps/backend/openapi.json` と `apps/frontend` の生成スキーマを再生成してコミットする（理由: backend の test/typecheck では契約 drift を検出できず、CI の「再生成ズレ検出」だけが落ちる）
- [ ] React Doctor: frontend で `bun run doctor`（score 低下なしを確認。`--diff` で変更分のみも可）
  - React Doctor は frontend スコープ（dep / config / 実行とも frontend）。編集バッチごとに PostToolBatch agent hook が frontend cwd で `--diff --fail-on warning` を自動実行し指摘を会話に返す（非ブロッキング）
  - 抑止/除外の設定は `apps/frontend/react-doctor.config.json`（生成 api.ts の unused-export / React Compiler 起因の FP / DESIGN.md 準拠の cosmetic 等を除外。各 ignore に根拠コメント必須。pre-commit hook もこの config を参照）
  - shadcn (`components/ui/`) も「自分たちのコード」として直す対象。原則 react-doctor の指摘を実コードで直し、blanket な ui 除外はしない
- [ ] **dev server で実機動作確認** (`http://localhost:3000` を playwright devtools mcpで開く)
  - 該当ページに到達 → 主要操作 (form 送信 / mutation / navigation) を 1 周
  - エラーケース (validation 失敗 / mutation 失敗) も実機で見る
  - MSW モードと実 backend モードの差異 (cookie / cache invalidate / 永続化反映) で挙動が違うことに注意
  - **Playwright MCP の native `browser_click` / `browser_fill_form` は React handler に届かないことがある** (Next16 Turbopack + React19。初回 1 回だけ動く等 不安定。描画 / データ取得 / 遷移は正常)。クリックは `browser_evaluate` の `element.click()` で dispatch する。ログインは突破せず mock id_token を `document.cookie` に直挿しでバイパス (値は `apps/frontend/src/mocks/handlers.ts` の MOCK_ID_TOKEN と同じ組み立て)。mutation 系の操作検証は real browser で通る Storybook play を根拠にしてもよい
  - **admin / role 限定ルートを MSW dev で確認するときはハードリロードが要る** (SPA ソフトナビは古い worker handlers と `/auth/me` キャッシュを保持し role 切替が効かない)。この dev 専用 mock 変更は feature diff に含めず確認後に戻す
- [ ] **レビュー用モック/レスポンスは現実の形を写す**: happy path だけでなく、現実に起きるエッジ形（複数ソースが同時にヒットする混在ケース / 空 / 矛盾）を再現する（理由: happy path のみのモックでは「本番で実際にどう表示されるか」を掴めず、UI 判断を誤る）

理由: Storybook は単一コンポーネントの play を見るだけで、**ページ全体の data flow / route guard / cookie / mutation 後の cache invalidate** までは検証していない。本番に近い経路を 1 度通さないと、`projectId` mismatch / 越境ガード / SSR-CSR 境界 / portal mount 漏れ などのバグが残る。

5. **Commit & Push**
   - Detailed commit messages
   - Follow conventional commits format
   - See [git-workflow.md](./git-workflow.md) for commit message format and PR process

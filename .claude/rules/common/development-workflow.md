# Development Workflow

> This file extends [common/git-workflow.md](./git-workflow.md) with the full feature development process that happens before git operations.

The Feature Implementation Workflow describes the development pipeline: research, planning, TDD, code review, and then committing to git.

## Feature Implementation Workflow

0. **Domain Understanding** _(最優先)_
   - ドメイン概念に触れる UI / 構造を作る前に、ドメイン文書があれば読む
   - 無ければユーザーに業務概念・依存関係・プロセス順序を聞く
   - UI のグループ化 / 並び順 / 優先度はドメインの依存方向に従う

1. **Research & Reuse** _(mandatory before any new implementation)_
   - **GitHub code search first:** Run `gh search repos` and `gh search code` to find existing implementations, templates, and patterns before writing anything new.
   - **Library docs second:** Use Context7 or primary vendor docs to confirm API behavior, package usage, and version-specific details before implementing.
   - **Exa only when the first two are insufficient:** Use Exa for broader web research or discovery after GitHub search and primary docs.
   - **Check package registries:** Search npm, PyPI, crates.io, and other registries before writing utility code. Prefer battle-tested libraries over hand-rolled solutions.
   - **Search for adaptable implementations:** Look for open-source projects that solve 80%+ of the problem and can be forked, ported, or wrapped.
   - Prefer adopting or porting a proven approach over writing net-new code when it meets the requirement.

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
- [ ] `bun run test` (unit + integration)
- [ ] `bun run test:storybook --run` (story の play function 含む)
- [ ] **dev server で実機動作確認** (`http://localhost:3000` を playwright devtools mcpで開く)
  - 該当ページに到達 → 主要操作 (form 送信 / mutation / navigation) を 1 周
  - エラーケース (validation 失敗 / mutation 失敗) も実機で見る
  - MSW モードと実 backend モードの差異 (cookie / cache invalidate / 永続化反映) で挙動が違うことに注意

理由: Storybook は単一コンポーネントの play を見るだけで、**ページ全体の data flow / route guard / cookie / mutation 後の cache invalidate** までは検証していない。本番に近い経路を 1 度通さないと、`projectId` mismatch / 越境ガード / SSR-CSR 境界 / portal mount 漏れ などのバグが残る。

5. **Commit & Push**
   - Detailed commit messages
   - Follow conventional commits format
   - See [git-workflow.md](./git-workflow.md) for commit message format and PR process

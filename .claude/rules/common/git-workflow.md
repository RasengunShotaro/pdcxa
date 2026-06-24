# Git Workflow

## Commit Message Format

```
<type>: <description>

<optional body>
```

Types: feat, fix, refactor, docs, test, chore, perf, ci

Note: Attribution disabled globally via ~/.claude/settings.json.

## Branch Naming

| 種別     | ブランチ名       | 例                           |
| -------- | ---------------- | ---------------------------- |
| 新機能   | `feature/<内容>` | `feature/demand-alert-staff` |
| バグ修正 | `fix/<内容>`     | `fix/baseline-validation`    |
| その他   | `chore/<内容>`   | `chore/deps-update`          |

## Pull Request Workflow

When creating PRs:

1. Analyze full commit history (not just latest commit)
2. Use `git diff [base-branch]...HEAD` to see all changes
3. Draft comprehensive PR summary
4. Include test plan with TODOs
5. Push with `-u` flag if new branch

PR のタイトル、本文、変更概要、テスト計画は日本語で書く。外部テンプレートやユーザーの明示指示が英語の場合だけ例外とする。

**機能 PR には「機能のコード + テスト + 生成物（API 契約等）」だけを入れる。** 判断のために書いた一度きりの計測 / 実験スクリプト・A/B ハーネス・設計メモは成果物ではないので含めない。PR 化の前に diff のファイル一覧を見て「これは機能か、自分の作業過程の産物か」を仕分け、計測 / 実験スクリプトは削除する（知見は commit / PR 本文・git 管理外の `docs/` に残す）。理由: 決定が済めば計測ツールは役目を終え、テストの無い研究スクリプトを製品リポジトリに残すと cruft になる。

## CI の起動条件・検証範囲（ローカルで全緑を自前担保する）

CI は手元の全テストを代わりに回してくれる存在ではない。前提を踏まえてローカルで担保する:

- **CI は main 向け PR で走る**。main 以外のブランチは push した時点で stg 環境へ自動デプロイされるので、push する前にローカルで緑を確認する
- **CI が回すのは unit test のみ**（storybook の play function は含まない）。`bun run test:storybook` 相当はローカルでしか担保されない
- **CI は「ブランチ + 最新 main のマージ」をテストする**。ブランチを切った後に main へ入った新ゲートと衝突し、ローカル緑でも落ちることがある。落ちたら `git merge origin/main` で取り込み、ローカルで再現・修正してから push

→ 報告前チェックリスト（development-workflow.md）の typecheck / test / storybook / API 契約再生成（api:generate / orval）を、CI 任せにせず自分で緑にする。

> For the full development process (planning, TDD, code review) before git operations,
> see [development-workflow.md](./development-workflow.md).

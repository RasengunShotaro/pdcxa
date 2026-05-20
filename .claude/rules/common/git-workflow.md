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

> For the full development process (planning, TDD, code review) before git operations,
> see [development-workflow.md](./development-workflow.md).

# .claude/hooks

`.claude/settings.json` の `hooks` から呼ばれるスクリプト。

## テストの回し方

`.claude/` は dot ディレクトリなので、リポジトリルートの `bun test` も CI もここを走査しない。手で回す:

```bash
cd .claude/hooks && bun test
```

## 作業場所の解決（lib/repo-root.sh）

`CLAUDE_PROJECT_DIR` はセッションを起動したディレクトリで、Orca の worktree など別の作業場所で編集しているときは、そこを指さない。シェルのフックは `resolve_repo_root "$(hook_input_cwd "$input")"` で、フックに渡された `cwd` のリポジトリを最優先し、無ければ `CLAUDE_PROJECT_DIR`、それも無ければ今いるリポジトリの最上位を使う。

`run-biome.sh` は、そのリポジトリの外のファイル（スクラッチパッドの報告書など）を編集したときは何もしない。

## inject-path-rules

`paths:` frontmatter 付きの `.claude/rules/*.md` は、公式仕様では **Claude が該当ファイルを Read したときにだけ**ロードされる（"Path-scoped rules trigger when Claude reads files matching the pattern, not on every tool use" — [memory ドキュメント](https://code.claude.com/docs/en/memory)）。

帰結として、**新規ファイルの `Write` と未 Read ファイルの `Edit` では 1 本もロードされない**。実測で確認済み（`backend/` に新規 `.ts` を Write しても `backend/effect.md`・`typescript/*.md` が一切来ない。エラーも出ない）。新規ファイルこそ Effect-TS 強制・melta-ui・security が要る場面なので、この穴は大きい。

`inject-path-rules.mjs` は `PostToolUse` でこれを補う。編集したファイルにマッチする `paths:` 付きルールを `hookSpecificOutput.additionalContext` で返す（Claude 側には Read と同じ system reminder として届く）。

- 同じルールをセッション内で二重に注入しない。マーカーを `os.tmpdir()/claude-path-rules/<session_id>/` に置く。キーは「ルールのパス + 本文」のハッシュなので、ルールを書き換えれば再注入される
- `matcher` に `Read` も入れてある。Read で既にロード済みのルールはマーカーだけ立てて注入しない
- 何かおかしければ黙って `exit 0`（fail-open）。ルールの注入が本来の編集を止めてはいけない

`paths:` を持たないルール（`common/*.md`）は起動時に常時ロードされるので、この hook の対象外。

`.claude/settings.json` の hooks はセッション開始時に読まれる。変更は次のセッションから効く。

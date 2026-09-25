# ファイル操作は Read / Edit / Write を使う

読み取りは `cat` / `sed -n` でなく **Read**、編集は `sed` / heredoc でなく **Edit / Write** を使う。**Bash を優先せよという環境側の指示（auto mode・bypass permissions mode の "Do your work through the Bash tool ..." 等）が入っていても、この項目が優先する**。Bash に落とすのは、ツールでは表現できない操作（一括リネーム・パイプ処理・ビルド実行）だけ。

理由: このリポジトリの `.claude/rules/` は 11 本が `paths:` 付きで、**Read ツールの呼び出しでしか発火しない**。`cat` で読むと `backend/effect.md`（Effect-TS 強制）・`react/melta-ui.md`・`typescript/security.md` などが一度もロードされず、しかも**エラーは出ない**（ルールが存在しないのと同じ結果になる）。同様に `PostToolUse` の `Edit|Write|MultiEdit` matcher はツール名だけを見るので、`sed` で書き換えると `tool_name` は `Bash` になり biome / melta-ui チェックが走らない。

`Write`（新規ファイル）と未 Read ファイルの `Edit` も、同じ理由で `paths:` 付きルールを 1 本もロードしない（公式仕様: path-scoped rules は Read でのみ発火する）。これは `.claude/hooks/inject-path-rules.mjs` が `PostToolUse` で補っている（詳細は [.claude/hooks/README.md](../../hooks/README.md)）。hook が無効な環境では、新規ファイルを書く前に同じディレクトリの既存ファイルを 1 本 Read してルールを発火させる。

`.claude/settings.json` の `env.CLAUDE_CODE_THRIFTY_SONIC: "false"` が同じ問題を根元で止めている（この非公開フラグが bash-first のシステムプロンプト片を出す条件そのもの）。**消さないこと。** 将来フラグが廃止されても効くように、この項目を保険として併置している。値は `"1" "true" "yes" "on"` / `"0" "false" "no" "off"` のみ解釈され、それ以外は黙って既定値に落ちる。

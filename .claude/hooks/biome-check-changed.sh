#!/usr/bin/env bash
# Stop hook: 未コミットの変更ファイル全体に biome check をかける最終ゲート。
# PostToolUse の run-biome.sh は Edit/Write にしか発火せず、Bash 経由の編集
# (sed / python / コード生成) を検査できないため、編集経路に依存しないここで拾う。
set -uo pipefail

cd "${CLAUDE_PROJECT_DIR:-.}"

files=$( (git diff --name-only HEAD; git ls-files --others --exclude-standard) 2>/dev/null | sort -u | grep -E '\.(ts|tsx|js|jsx|mjs|cjs|json|jsonc)$' || true)
[ -z "$files" ] && exit 0

existing=()
while IFS= read -r f; do
  [ -f "$f" ] && existing+=("$f")
done <<<"$files"
[ ${#existing[@]} -eq 0 ] && exit 0

runner=""
if command -v bun >/dev/null 2>&1; then
  runner="bunx --bun"
elif command -v npx >/dev/null 2>&1; then
  runner="npx --yes"
else
  exit 0
fi

out=$($runner @biomejs/biome check --no-errors-on-unmatched --files-ignore-unknown=true "${existing[@]}" 2>&1)
status=$?
if [ $status -ne 0 ]; then
  {
    echo "[biome stop hook] 未コミットの変更に biome エラーがあります。修正してから終了してください:"
    echo "$out" | tail -40
  } >&2
  exit 2
fi
exit 0

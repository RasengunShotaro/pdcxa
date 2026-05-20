#!/usr/bin/env bash
set -euo pipefail

input=$(cat)
file_path=$(echo "$input" | jq -r '.tool_input.file_path // empty')
[ -z "$file_path" ] && exit 0

cd "${CLAUDE_PROJECT_DIR:-.}"

args=(check --write --unsafe --no-errors-on-unmatched --files-ignore-unknown=true "$file_path")

if command -v bun >/dev/null 2>&1; then
  bunx --bun @biomejs/biome "${args[@]}" || exit 2
elif command -v npx >/dev/null 2>&1; then
  npx --yes @biomejs/biome "${args[@]}" || exit 2
else
  echo "[biome hook] bun/npx not found; skipping" >&2
  exit 0
fi

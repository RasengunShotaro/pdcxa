#!/usr/bin/env bash
set -euo pipefail

SCRIPT="${CLAUDE_PROJECT_DIR:-.}/.claude/hooks/check-melta-rules.mjs"

if command -v bun >/dev/null 2>&1; then
  exec bun "$SCRIPT"
elif command -v node >/dev/null 2>&1; then
  exec node "$SCRIPT"
else
  echo "[melta-ui hook] bun/node not found; skipping" >&2
  exit 0
fi

#!/usr/bin/env bash
set -euo pipefail

SCRIPT="${CLAUDE_PROJECT_DIR:-.}/.claude/hooks/inject-path-rules.mjs"

if command -v bun >/dev/null 2>&1; then
  exec bun "$SCRIPT"
elif command -v node >/dev/null 2>&1; then
  exec node "$SCRIPT"
else
  exit 0
fi

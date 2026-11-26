#!/usr/bin/env bash
set -uo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
log="${TMPDIR:-/tmp}/pdcxa-melta-ui-mcp.log"

if ! PDCXA_SETUP_LOG="$log" \
  PDCXA_MELTA_LOCK_TIMEOUT="${PDCXA_MELTA_LOCK_TIMEOUT:-25}" \
  PDCXA_MELTA_COPY_ONLY=1 \
  "$root/scripts/ensure-melta-ui.sh" >/dev/null 2>&1 </dev/null; then
  printf 'melta-ui is not ready; run scripts/worktree-setup.sh (log: %s)\n' "$log" >&2
  exit 1
fi

exec node "$root/melta-ui/dist/index.js"

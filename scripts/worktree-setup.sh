#!/usr/bin/env bash
set -uo pipefail

log="${PDCXA_SETUP_LOG:-/tmp/pdcxa-worktree-setup.log}"
: >"$log"
summary=()

sha256() {
  if command -v sha256sum >/dev/null 2>&1; then
    sha256sum "$1" | cut -d' ' -f1
  else
    shasum -a 256 "$1" | cut -d' ' -f1
  fi
}

gitignored_locals=(
  .claude/settings.local.json
)

primary="$(cd "$(dirname "$(git rev-parse --git-common-dir)")" && pwd)"

if [ "$primary" != "$PWD" ]; then
  copied=0
  missing=0
  for path in "${gitignored_locals[@]}"; do
    [ -e "$path" ] && continue
    if [ -e "$primary/$path" ]; then
      mkdir -p "$(dirname "$path")"
      cp "$primary/$path" "$path" && copied=$((copied + 1))
    else
      missing=$((missing + 1))
      printf 'not found in primary checkout: %s\n' "$primary/$path" >>"$log"
    fi
  done
  summary+=("locals=copied:$copied,absent:$missing")
fi

lock_stamp=node_modules/.pdcxa-lock-hash
lock_hash="$(sha256 bun.lock 2>/dev/null)"

if [ -d node_modules ] && [ "$(cat "$lock_stamp" 2>/dev/null)" = "$lock_hash" ]; then
  summary+=("deps=present")
elif bun install >>"$log" 2>&1; then
  printf '%s' "$lock_hash" >"$lock_stamp"
  summary+=("deps=installed")
else
  summary+=("deps=FAILED")
fi

if melta_state="$("$(dirname "${BASH_SOURCE[0]}")/ensure-melta-ui.sh")"; then
  summary+=("melta-ui=$melta_state")
else
  summary+=("melta-ui=FAILED")
fi

printf 'setup: %s (log: %s)\n' "${summary[*]}" "$log"

case "${summary[*]}" in
  *FAILED* | *MISSING*)
    printf '\n--- %s last 40 lines ---\n' "$log" >&2
    tail -40 "$log" >&2
    ;;
esac

exit 0

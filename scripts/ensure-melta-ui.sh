#!/usr/bin/env bash
set -uo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$root" || exit 1

log="${PDCXA_SETUP_LOG:-/tmp/pdcxa-worktree-setup.log}"
lock_timeout="${PDCXA_MELTA_LOCK_TIMEOUT:-300}"
copy_only="${PDCXA_MELTA_COPY_ONLY:-0}"

ready=node_modules/.pdcxa-melta-ui-ready
primary="$(cd "$(dirname "$(git rev-parse --git-common-dir)")" && pwd)"

sha256() {
  if command -v sha256sum >/dev/null 2>&1; then
    sha256sum | cut -d' ' -f1
  elif command -v shasum >/dev/null 2>&1; then
    shasum -a 256 | cut -d' ' -f1
  else
    return 1
  fi
}

lock_key="$(printf '%s' "$root" | sha256)"
if [ -z "$lock_key" ]; then
  printf 'no sha256 implementation available\n' >>"$log"
  exit 1
fi
lock="${TMPDIR:-/tmp}/pdcxa-melta-ui-${lock_key:0:16}.lock"

is_ready() {
  [ -f "$ready" ] && [ -f melta-ui/dist/index.js ]
}

mark_ready() {
  mkdir -p "$(dirname "$ready")" && : >"$ready"
}

looks_complete() {
  [ -f melta-ui/dist/index.js ] &&
    [ -f melta-ui/package.json ] &&
    [ -d melta-ui/node_modules/@modelcontextprotocol/sdk ]
}

acquire_lock() {
  local deadline holder
  deadline=$(($(date +%s) + lock_timeout))
  while :; do
    if mkdir "$lock" 2>/dev/null; then
      printf '%s' "$$" >"$lock/pid"
      return 0
    fi
    is_ready && return 2
    holder="$(cat "$lock/pid" 2>/dev/null)"
    if [ -n "$holder" ] && ! kill -0 "$holder" 2>/dev/null; then
      printf 'reclaiming lock from dead pid %s\n' "$holder" >>"$log"
      rm -rf "$lock"
      continue
    fi
    if [ "$(date +%s)" -ge "$deadline" ]; then
      return 1
    fi
    sleep 1
  done
}

build_melta_ui() {
  (cd melta-ui && bun install && bun run build) >>"$log" 2>&1
  [ -f melta-ui/dist/index.js ]
}

reset_melta_ui() {
  rm -f "$ready"
  rm -rf melta-ui
  mkdir -p melta-ui
}

copy_melta_ui_from_primary() {
  local recorded primary_head
  recorded="$(git ls-tree HEAD melta-ui | awk '{print $3}')"
  primary_head="$(git -C "$primary/melta-ui" rev-parse HEAD 2>/dev/null)"
  [ -n "$recorded" ] || return 1
  [ "$recorded" = "$primary_head" ] || return 1
  [ -f "$primary/melta-ui/dist/index.js" ] || return 1

  reset_melta_ui
  cp -Rc "$primary/melta-ui/." melta-ui/ 2>>"$log" ||
    cp -R "$primary/melta-ui/." melta-ui/ >>"$log" 2>&1 ||
    return 1
  rm -rf melta-ui/.git
  [ -f melta-ui/dist/index.js ]
}

extract_and_build_melta_ui() {
  local recorded
  recorded="$(git ls-tree HEAD melta-ui | awk '{print $3}')"
  [ -n "$recorded" ] || return 1
  git -C "$primary/melta-ui" cat-file -e "$recorded^{commit}" 2>/dev/null ||
    git -C "$primary/melta-ui" fetch --quiet origin "$recorded" >>"$log" 2>&1 ||
    return 1

  reset_melta_ui
  git -C "$primary/melta-ui" archive "$recorded" 2>>"$log" | tar -x -C melta-ui || return 1
  build_melta_ui
}

if is_ready; then
  printf 'present\n'
  exit 0
fi

acquire_lock
case $? in
  2)
    printf 'present\n'
    exit 0
    ;;
  1)
    printf 'timed out waiting for %s\n' "$lock" >>"$log"
    exit 1
    ;;
esac
trap 'rm -rf "$lock"' EXIT

if is_ready; then
  printf 'present\n'
  exit 0
fi

if looks_complete; then
  mark_ready
  printf 'present\n'
  exit 0
fi

if [ "$primary" = "$root" ]; then
  if [ "$copy_only" = 1 ]; then
    printf 'primary checkout needs scripts/worktree-setup.sh\n' >>"$log"
    exit 1
  fi
  rm -f "$ready"
  if git submodule update --init --recursive >>"$log" 2>&1 && build_melta_ui; then
    mark_ready
    printf 'initialized\n'
    exit 0
  fi
  exit 1
fi

if copy_melta_ui_from_primary; then
  mark_ready
  printf 'copied\n'
  exit 0
fi

if [ "$copy_only" = 1 ]; then
  printf 'primary checkout is not at the recorded melta-ui commit; run scripts/worktree-setup.sh\n' >>"$log"
  exit 1
fi

if extract_and_build_melta_ui; then
  mark_ready
  printf 'built\n'
  exit 0
fi

exit 1

#!/usr/bin/env bash
resolve_repo_root() {
  local hint="${1:-}" root
  if [ -n "$hint" ] && [ -d "$hint" ]; then
    root=$(git -C "$hint" rev-parse --show-toplevel 2>/dev/null) && [ -n "$root" ] && {
      printf '%s' "$root"
      return 0
    }
  fi
  if [ -n "${CLAUDE_PROJECT_DIR:-}" ] && [ -d "$CLAUDE_PROJECT_DIR" ]; then
    printf '%s' "$CLAUDE_PROJECT_DIR"
    return 0
  fi
  root=$(git rev-parse --show-toplevel 2>/dev/null) && [ -n "$root" ] && {
    printf '%s' "$root"
    return 0
  }
  printf '%s' "$PWD"
}

hook_input_cwd() {
  command -v jq >/dev/null 2>&1 || return 0
  printf '%s' "${1:-}" | jq -r '.cwd // empty' 2>/dev/null || true
}

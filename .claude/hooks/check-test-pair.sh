#!/usr/bin/env bash
# Stop hook: 変更/新規追加された src/**/*.ts(x) に対応するペア (.test / .spec / .stories) があるか確認する。
# 警告のみ (exit 0)。判断は Claude / 開発者に委ねる。
# 明らかにテスト不要な規約ファイル (Next.js app router 規約、shadcn UI 等) は最初から除外する。
set -euo pipefail

input=$(cat)

stop_hook_active=$(printf '%s' "$input" | python3 -c '
import json, sys
try:
    data = json.load(sys.stdin)
    print(data.get("stop_hook_active", False))
except Exception:
    print(False)
')

if [[ "$stop_hook_active" == "True" ]]; then
  exit 0
fi

cd "${CLAUDE_PROJECT_DIR:-.}"

changed=()
while IFS= read -r line; do
  [[ -n "$line" ]] && changed+=("$line")
done < <(
  git status --porcelain 2>/dev/null \
    | sed -E 's/^...//' \
    | grep -E '(^|/)src/.*\.(ts|tsx)$' \
    | grep -v -E '\.(test|spec|stories|d)\.(ts|tsx)$' \
    | grep -v -E '(^|/)(layout|page|loading|error|not-found|template|default|route|global-error)\.(ts|tsx)$' \
    | grep -v -E '(^|/)components/ui/' \
    || true
)

missing=()
for src in "${changed[@]}"; do
  base="${src%.*}"
  ext="${src##*.}"
  if [[ ! -f "${base}.test.${ext}" \
     && ! -f "${base}.spec.${ext}" \
     && ! -f "${base}.stories.${ext}" ]]; then
    missing+=("$src")
  fi
done

if (( ${#missing[@]} > 0 )); then
  {
    echo "[警告] 次のソースファイルに対応するテストがありません (要確認):"
    for s in "${missing[@]}"; do
      base="${s%.*}"
      ext="${s##*.}"
      echo "  - $s  -> 期待: ${base}.test.${ext} / ${base}.stories.${ext}"
    done
    echo ""
    echo "判断基準は .claude/rules/common/testing.md / typescript/testing.md / react/testing.md を参照。"
    echo "外部APIの薄いラッパー等、テスト不要な場合はスキップ可。"
  } >&2
fi

exit 0

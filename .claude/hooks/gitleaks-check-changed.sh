#!/usr/bin/env bash
# Stop hook: 未コミットの変更ファイル (tracked diff + untracked) を gitleaks で
# secret スキャンする最終ゲート。AWS 鍵・トークン等のコミット前漏洩を防ぐ。
# 変更ファイルだけを temp ディレクトリに写してから `gitleaks dir` にかける
# (リポジトリ全体を直接スキャンすると node_modules まで舐めて遅く・ノイジーになるため)。
set -uo pipefail

cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0

# gitleaks が無い環境では fail-open (セッションを止めない)。導入方法だけ案内する。
if ! command -v gitleaks >/dev/null 2>&1; then
  echo "[gitleaks stop hook] gitleaks 未インストールのため secret スキャンを skip しました (brew install gitleaks)。" >&2
  exit 0
fi

files=$( (git diff --name-only --diff-filter=d HEAD; git ls-files --others --exclude-standard) 2>/dev/null | sort -u)
[ -z "$files" ] && exit 0

staging=$(mktemp -d "${TMPDIR:-/tmp}/gitleaks-staging.XXXXXX")
trap 'rm -rf "$staging"' EXIT

copied=0
while IFS= read -r f; do
  [ -n "$f" ] || continue
  [ -f "$f" ] || continue
  mkdir -p "$staging/$(dirname "$f")"
  cp "$f" "$staging/$f" 2>/dev/null && copied=$((copied + 1))
done <<<"$files"
[ "$copied" -eq 0 ] && exit 0

config_args=()
[ -f .gitleaks.toml ] && config_args=(--config .gitleaks.toml)

report=$(mktemp "${TMPDIR:-/tmp}/gitleaks-report.XXXXXX")
trap 'rm -rf "$staging" "$report"' EXIT

if gitleaks dir "$staging" \
  ${config_args[@]+"${config_args[@]}"} \
  --no-banner \
  --redact \
  --report-format json \
  --report-path "$report" >/dev/null 2>&1; then
  exit 0
fi

# 変更ファイルのパスは staging プレフィックスを剥がして実パスで見せる。
findings=$(
  STAGING="$staging" node - "$report" <<'NODE' 2>/dev/null
const fs = require("node:fs");
try {
  const list = JSON.parse(fs.readFileSync(process.argv[2], "utf8") || "[]");
  const lines = list.map((l) => {
    const file = (l.File || "").replace(/^.*\/gitleaks-staging\.[^/]+\//, "");
    return `  - ${l.RuleID}: ${file}:${l.StartLine} (${l.Description || ""})`;
  });
  process.stdout.write(lines.join("\n"));
} catch {}
NODE
)

{
  echo "[gitleaks stop hook] 変更ファイルに secret の疑いがあります。コミット前に除去してください:"
  if [ -n "$findings" ]; then
    echo "$findings"
  else
    echo "  (gitleaks がエラー終了しました。手動で 'gitleaks dir .' を確認してください)"
  fi
  echo "  誤検知の場合は .gitleaks.toml の allowlist に根拠コメント付きで追加してください。"
} >&2
exit 2

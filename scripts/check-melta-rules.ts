import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { lintHtmlAttrs } from "../melta-ui/src/utils/attr-lint.ts";
import { getAllRules } from "../melta-ui/src/utils/loader.ts";
import {
  isAutoDetectable,
  matches,
  tokenize,
} from "../melta-ui/src/utils/matcher.ts";
import type { LintViolation } from "../melta-ui/src/utils/types.ts";

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const TARGET_DIR = join(REPO_ROOT, "apps/frontend/src");

const CLASS_LIKE =
  /(?:^|\s)(?:[a-z-]+\[[^\]]*\]:|[a-z-]+:)*(?:bg|text|border|shadow|rounded|ring|outline|p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|w|h|min-w|min-h|max-w|max-h|font|leading|tracking|z|opacity|space|divide|animate|transition|cursor|flex|grid|items|justify|truncate|line-clamp|absolute|relative|fixed|sticky|inline-flex)(?:-|$)/;

const LITERAL = /"([^"\n]{2,800})"|'([^'\n]{2,800})'|`([^`]{2,800})`/g;

interface FileViolation extends LintViolation {
  readonly file: string;
}

const rules = getAllRules().filter(
  (rule) => isAutoDetectable(rule) && !rule.requiresContext,
);

function collectClassStrings(source: string): string[] {
  const out: string[] = [];
  for (const match of source.matchAll(LITERAL)) {
    const literal = match[1] ?? match[2] ?? match[3];
    if (!literal || !CLASS_LIKE.test(literal)) continue;
    out.push(literal);
  }
  return out;
}

function lintClassStrings(source: string): LintViolation[] {
  const violations: LintViolation[] = [];
  const seen = new Set<string>();
  for (const classString of collectClassStrings(source)) {
    for (const ctx of tokenize(classString)) {
      for (const rule of rules) {
        if (!matches(rule, ctx)) continue;
        const key = `${rule.id}::${ctx.raw}`;
        if (seen.has(key)) continue;
        seen.add(key);
        violations.push({
          ruleId: rule.id,
          severity: rule.severity,
          token: ctx.raw,
          category: rule.category,
          reason: rule.description,
          alternative: rule.alternative,
        });
      }
    }
  }
  return violations;
}

function lint(source: string): LintViolation[] {
  return [...lintClassStrings(source), ...lintHtmlAttrs(source)];
}

const SELF_TEST_SOURCE = `
const variants = cva("inline-flex", {
  variants: { tone: { ghost: "text-black shadow-2xl" } },
});
export function Row() {
  return <table><tr><th>見出し</th></tr></table>;
}
`;

function assertDetectorAlive(): void {
  const found = new Set(lint(SELF_TEST_SOURCE).map((v) => v.ruleId));
  const expected = [
    "COLOR_NO_TEXT_BLACK",
    "SPACE_NO_SHADOW_2XL",
    "TABLE_TH_SCOPE_REQUIRED",
  ];
  const missed = expected.filter((id) => !found.has(id));
  if (missed.length === 0) return;
  console.error(
    `[melta-ui] 検出器が壊れています: 埋め込み違反 ${missed.join(", ")} を検出できませんでした`,
  );
  process.exit(1);
}

function listSourceFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules") continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      out.push(...listSourceFiles(full));
      continue;
    }
    if (/\.(tsx|jsx|ts|js)$/.test(entry)) out.push(full);
  }
  return out;
}

const HEX = /^#[0-9a-fA-F]{6}$/;

function parseThemeBlock(css: string, selector: string): Map<string, string> {
  const start = css.indexOf(selector);
  const open = css.indexOf("{", start);
  const close = css.indexOf("\n}", open);
  const body = css.slice(open + 1, close);
  const vars = new Map<string, string>();
  for (const line of body.split("\n")) {
    const m = /^\s*(--[\w-]+)\s*:\s*([^;]+);/.exec(line);
    if (m) vars.set(m[1], m[2].trim());
  }
  return vars;
}

function resolveVar(name: string, vars: Map<string, string>): string | null {
  let value = vars.get(name);
  for (let depth = 0; depth < 8 && value != null; depth++) {
    if (HEX.test(value)) return value.toLowerCase();
    const ref = /^var\((--[\w-]+)\)$/.exec(value);
    if (!ref) return null;
    value = vars.get(ref[1]);
  }
  return null;
}

function relativeLuminance(hex: string): number {
  const channel = (v: number) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  const n = Number.parseInt(hex.slice(1), 16);
  return (
    0.2126 * channel((n >> 16) & 255) +
    0.7152 * channel((n >> 8) & 255) +
    0.0722 * channel(n & 255)
  );
}

function contrast(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

const CONTRAST_PAIRS: ReadonlyArray<readonly [string, string]> = [
  ["--text-heading", "--bg-page"],
  ["--text-heading", "--bg-surface"],
  ["--text-default", "--bg-page"],
  ["--text-default", "--bg-surface"],
  ["--text-muted", "--bg-page"],
  ["--text-muted", "--bg-surface"],
  ["--text-link", "--bg-page"],
  ["--text-link", "--bg-surface"],
  ["--text-link-strong", "--bg-page"],
  ["--text-link-strong", "--bg-surface"],
  ["--text-heading", "--bg-raised"],
  ["--text-default", "--bg-raised"],
  ["--text-link-strong", "--bg-raised"],
  ["--muted-foreground", "--muted"],
  ["--secondary-foreground", "--secondary"],
  ["--accent-foreground", "--accent"],
];

const AA = 4.5;

function checkTokenContrast(): string[] {
  const css = readFileSync(
    join(REPO_ROOT, "apps/frontend/src/app/globals.css"),
    "utf-8",
  );
  const light = parseThemeBlock(css, ":root {");
  const darkOverrides = parseThemeBlock(css, ".dark {");
  const dark = new Map([...light, ...darkOverrides]);

  const failures: string[] = [];
  for (const [theme, vars] of [
    ["light", light],
    ["dark", dark],
  ] as const) {
    for (const [fg, bg] of CONTRAST_PAIRS) {
      const fgHex = resolveVar(fg, vars);
      const bgHex = resolveVar(bg, vars);
      if (fgHex == null || bgHex == null) continue;
      const ratio = contrast(fgHex, bgHex);
      if (ratio < AA) {
        failures.push(
          `  ${theme}: ${fg} (${fgHex}) on ${bg} (${bgHex}) = ${ratio.toFixed(2)}:1 < ${AA}`,
        );
      }
    }
    const onPrimary = resolveVar("--primary", vars);
    if (onPrimary != null) {
      const ratio = contrast("#ffffff", onPrimary);
      if (ratio < AA) {
        failures.push(
          `  ${theme}: #ffffff on --primary (${onPrimary}) = ${ratio.toFixed(2)}:1 < ${AA}`,
        );
      }
    }
  }
  return failures;
}

assertDetectorAlive();

const contrastFailures = checkTokenContrast();
if (contrastFailures.length > 0) {
  console.error("[melta-ui] トークンのコントラストが AA を下回っています:");
  for (const line of contrastFailures) console.error(line);
  process.exit(1);
}

const files = listSourceFiles(TARGET_DIR);
const violations: FileViolation[] = [];
for (const file of files) {
  const source = readFileSync(file, "utf-8");
  for (const violation of lint(source)) {
    violations.push({ ...violation, file: relative(REPO_ROOT, file) });
  }
}

const errors = violations.filter((v) => v.severity === "error");
const warns = violations.filter((v) => v.severity !== "error");

const format = (v: FileViolation) =>
  `  ${v.file}  ${v.token}  [${v.ruleId}] ${v.reason}` +
  (v.alternative ? `\n    → ${v.alternative}` : "");

if (warns.length > 0) {
  console.error(`[melta-ui] warn ${warns.length} 件:`);
  for (const v of warns) console.error(format(v));
}

if (errors.length > 0) {
  console.error(`[melta-ui] error ${errors.length} 件:`);
  for (const v of errors) console.error(format(v));
  process.exit(1);
}

console.log(
  `[melta-ui] ${files.length} ファイル / 自動検出 ${rules.length + getAllRules().filter((r) => r.htmlAttrCheck != null).length} ルール: 違反なし`,
);

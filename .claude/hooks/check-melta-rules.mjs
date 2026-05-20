import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

let inputStr = "";
for await (const chunk of process.stdin) inputStr += chunk;

let event;
try {
  event = JSON.parse(inputStr);
} catch {
  process.exit(0);
}

const filePath = event?.tool_input?.file_path;
const success = event?.tool_response?.success !== false;

if (!filePath || !success) process.exit(0);
if (!/\bfrontend\/.+\.(tsx|jsx|ts|js)$/.test(filePath)) process.exit(0);
if (!existsSync(filePath)) process.exit(0);

let checkRule;
try {
  ({ checkRule } = await import(
    resolve(__dirname, "../../melta-ui/dist/tools/check-rule.js")
  ));
} catch {
  process.exit(0);
}

let source;
try {
  source = readFileSync(filePath, "utf-8");
} catch {
  process.exit(0);
}

const classStrings = new Set();
for (const m of source.matchAll(/className\s*=\s*"([^"]*)"/g)) {
  classStrings.add(m[1]);
}
for (const m of source.matchAll(/className\s*=\s*'([^']*)'/g)) {
  classStrings.add(m[1]);
}
for (const m of source.matchAll(/className\s*=\s*\{([^}]*)\}/g)) {
  for (const s of m[1].matchAll(/"([^"]*)"|'([^']*)'|`([^`]*)`/g)) {
    classStrings.add(s[1] || s[2] || s[3]);
  }
}

const violations = [];
for (const cls of classStrings) {
  if (!cls) continue;
  for (const v of checkRule(cls)) violations.push(v);
}

if (violations.length === 0) process.exit(0);

const fmt = (v) =>
  `  - ${v.class}  [${v.ruleId}] ${v.reason}` +
  (v.alternative ? `\n    → ${v.alternative}` : "");

const errors = violations.filter((v) => v.severity === "error");
const warns = violations.filter((v) => v.severity !== "error");

if (errors.length > 0) {
  console.error(`[melta-ui] ${filePath} に禁止クラス検出 (error):`);
  for (const v of errors) console.error(fmt(v));
  if (warns.length > 0) {
    console.error("");
    console.error("[melta-ui] warn:");
    for (const v of warns) console.error(fmt(v));
  }
  process.exit(2);
}

console.error(`[melta-ui] ${filePath} に warn:`);
for (const v of warns) console.error(fmt(v));
process.exit(0);

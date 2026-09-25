import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { parseRulePaths, rulesForPath } from "./path-rules.mjs";

let inputStr = "";
for await (const chunk of process.stdin) inputStr += chunk;

let event;
try {
  event = JSON.parse(inputStr);
} catch {
  process.exit(0);
}

const filePath = event?.tool_input?.file_path;
if (!filePath || event?.tool_response?.success === false) process.exit(0);

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const relativePath = relative(repoRoot, filePath).split(sep).join("/");
if (relativePath.startsWith("..")) process.exit(0);

const rulesRoot = join(repoRoot, ".claude", "rules");
if (!existsSync(rulesRoot)) process.exit(0);

const ruleFilesIn = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return ruleFilesIn(full);
    return entry.name.endsWith(".md") ? [full] : [];
  });

let matched;
try {
  const rules = ruleFilesIn(rulesRoot).map((path) => {
    const content = readFileSync(path, "utf-8");
    return { path, content, globs: parseRulePaths(content) };
  });
  matched = rulesForPath({ relativePath, rules });
} catch {
  process.exit(0);
}

if (matched.length === 0) process.exit(0);

const sessionId =
  String(event?.session_id ?? "").replace(/[^a-zA-Z0-9_-]/g, "") || "default";
const markerDir = join(tmpdir(), "claude-path-rules", sessionId);

let pending;
try {
  mkdirSync(markerDir, { recursive: true });
  pending = matched.filter((rule) => {
    const marker = join(
      markerDir,
      createHash("sha1").update(`${rule.path}\0${rule.content}`).digest("hex"),
    );
    if (existsSync(marker)) return false;
    writeFileSync(marker, "");
    return true;
  });
} catch {
  process.exit(0);
}

if (event?.tool_name === "Read" || pending.length === 0) process.exit(0);

const header = `${relativePath} に適用される .claude/rules です。Write / Edit は Read と違い path-scoped rule を自動ロードしない（公式仕様: rules trigger when Claude reads matching files, not on every tool use）ため、この hook が補っています。このファイルを書く際は以下に従ってください。既に書いた内容が違反していれば直してください。`;

const body = pending
  .map((rule) => `Contents of ${rule.path}:\n\n${rule.content}`)
  .join("\n\n");

process.stdout.write(
  JSON.stringify({
    hookSpecificOutput: {
      hookEventName: "PostToolUse",
      additionalContext: `${header}\n\n${body}`,
    },
  }),
);

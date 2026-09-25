import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

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

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const result = spawnSync(
  "bun",
  [resolve(repoRoot, "scripts/check-melta-rules.ts")],
  {
    cwd: repoRoot,
    encoding: "utf-8",
  },
);

if (result.error || result.status === null) process.exit(0);
if (result.status === 0) process.exit(0);

process.stderr.write(result.stderr || result.stdout || "");
process.exit(2);

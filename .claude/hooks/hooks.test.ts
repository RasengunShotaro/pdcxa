import { afterEach, describe, expect, it } from "bun:test";
import { spawnSync } from "node:child_process";
import {
  mkdirSync,
  mkdtempSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

const hooksDir = import.meta.dir;
const created: string[] = [];

afterEach(() => {
  for (const dir of created.splice(0)) rmSync(dir, { recursive: true });
});

const gitRepo = (): string => {
  const dir = realpathSync(mkdtempSync(join(tmpdir(), "agent-hooks-")));
  created.push(dir);
  spawnSync("git", ["init", "-q"], { cwd: dir });
  return dir;
};

interface WriteInput {
  readonly root: string;
  readonly path: string;
  readonly content?: string;
}

const writeIn = ({ root, path, content = "" }: WriteInput): void => {
  mkdirSync(dirname(join(root, path)), { recursive: true });
  writeFileSync(join(root, path), content);
};

interface RunInput {
  readonly command: string;
  readonly cwd: string;
  readonly stdin?: string;
  readonly env?: Record<string, string>;
}

const run = ({ command, cwd, stdin = "{}", env = {} }: RunInput) =>
  spawnSync("bash", ["-c", command], {
    cwd,
    input: stdin,
    encoding: "utf8",
    env: { PATH: process.env.PATH, HOME: process.env.HOME, ...env },
  });

describe("resolve_repo_root", () => {
  const resolveFrom = (input: Omit<RunInput, "command">) =>
    run({
      ...input,
      command: `. "${hooksDir}/lib/repo-root.sh"; resolve_repo_root "$(hook_input_cwd "$(cat)")"`,
    }).stdout;

  it("フックに渡された作業場所のリポジトリを、起動元のプロジェクトより優先する", () => {
    const project = gitRepo();
    const worktree = gitRepo();
    writeIn({ root: worktree, path: "backend/x.ts" });

    const root = resolveFrom({
      cwd: project,
      stdin: JSON.stringify({ cwd: join(worktree, "backend") }),
      env: { CLAUDE_PROJECT_DIR: project },
    });

    expect(root).toBe(worktree);
  });

  it("作業場所が渡されなければ起動元のプロジェクトを使う", () => {
    const project = gitRepo();

    const root = resolveFrom({
      cwd: tmpdir(),
      env: { CLAUDE_PROJECT_DIR: project },
    });

    expect(root).toBe(project);
  });

  it("どちらも無ければ今いるリポジトリの最上位を使う", () => {
    const repo = gitRepo();
    writeIn({ root: repo, path: "frontend/a.ts" });

    const root = resolveFrom({ cwd: join(repo, "frontend") });

    expect(root).toBe(repo);
  });
});

describe("check-test-pair.sh", () => {
  const checkTestPair = (input: Omit<RunInput, "command">) =>
    run({ ...input, command: `"${hooksDir}/check-test-pair.sh"` });

  it("テストの無い新しいソースを警告する", () => {
    const repo = gitRepo();
    writeIn({ root: repo, path: "apps/backend/src/foo.ts" });

    const result = checkTestPair({ cwd: repo });

    expect(result.stderr).toContain("apps/backend/src/foo.ts");
  });

  it("生成した API 契約のファイルは警告しない", () => {
    const repo = gitRepo();
    writeIn({ root: repo, path: "apps/frontend/src/schema/api.ts" });

    const result = checkTestPair({ cwd: repo });

    expect(result.stderr).toBe("");
  });

  it("停止フックからの再実行では何も言わない", () => {
    const repo = gitRepo();
    writeIn({ root: repo, path: "apps/backend/src/foo.ts" });

    const result = checkTestPair({
      cwd: repo,
      stdin: JSON.stringify({ stop_hook_active: true }),
    });

    expect(result.stderr).toBe("");
  });
});

describe("run-biome.sh", () => {
  it("リポジトリの外のファイルを編集しても止めない", () => {
    const repo = gitRepo();
    writeIn({
      root: repo,
      path: "biome.json",
      content: JSON.stringify({
        vcs: { enabled: true, clientKind: "git", useIgnoreFile: true },
      }),
    });
    writeIn({ root: repo, path: ".gitignore", content: "node_modules/\n" });
    const outside = realpathSync(mkdtempSync(join(tmpdir(), "outside-")));
    created.push(outside);
    writeIn({ root: outside, path: "report.md", content: "# 報告\n" });

    const result = run({
      command: `"${hooksDir}/run-biome.sh"`,
      cwd: repo,
      stdin: JSON.stringify({
        cwd: repo,
        tool_input: { file_path: join(outside, "report.md") },
      }),
      env: { CLAUDE_PROJECT_DIR: repo },
    });

    expect(result).toMatchObject({ status: 0, stderr: "" });
  });
});

describe("react-doctor.sh", () => {
  it("編集を含まないバッチでは診断を回さない", () => {
    const repo = gitRepo();
    writeIn({ root: repo, path: "apps/frontend/package.json", content: "{}" });

    const result = run({
      command: `"${hooksDir}/react-doctor.sh"`,
      cwd: repo,
      stdin: JSON.stringify({
        hook_event_name: "PostToolBatch",
        cwd: repo,
        tool_calls: [{ tool_name: "Read" }, { tool_name: "Bash" }],
      }),
    });

    expect(result).toMatchObject({ status: 0, stdout: "", stderr: "" });
  });
});

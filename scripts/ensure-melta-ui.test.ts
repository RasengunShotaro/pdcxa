import { afterEach, expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const scriptSource = join(import.meta.dir, "ensure-melta-ui.sh");
const readyMarker = "node_modules/.pdcxa-melta-ui-ready";

const gitEnv = {
  GIT_AUTHOR_NAME: "pdcxa-test",
  GIT_AUTHOR_EMAIL: "pdcxa-test@example.com",
  GIT_COMMITTER_NAME: "pdcxa-test",
  GIT_COMMITTER_EMAIL: "pdcxa-test@example.com",
};

interface GitInput {
  readonly cwd: string;
  readonly args: readonly string[];
}

function git({ cwd, args }: GitInput): string {
  const result = spawnSync("git", [...args], {
    cwd,
    encoding: "utf8",
    env: { ...process.env, ...gitEnv },
  });
  if (result.status !== 0) {
    throw new Error(`git ${args.join(" ")} failed: ${result.stderr}`);
  }
  return result.stdout.trim();
}

interface WriteInput {
  readonly path: string;
  readonly content: string;
}

function write({ path, content }: WriteInput): void {
  mkdirSync(join(path, ".."), { recursive: true });
  writeFileSync(path, content);
}

interface Fixture {
  readonly tmp: string;
  readonly primary: string;
  readonly worktree: string;
}

let fixture: Fixture | undefined;

function current(): Fixture {
  if (!fixture) {
    throw new Error("fixture has not been created");
  }
  return fixture;
}

function wt(...segments: string[]): string {
  return join(current().worktree, ...segments);
}

function buildMeltaUiRepo({
  primary,
  trackDist,
}: {
  primary: string;
  trackDist: boolean;
}): string {
  const meltaUi = join(primary, "melta-ui");
  mkdirSync(meltaUi, { recursive: true });
  git({ cwd: meltaUi, args: ["init", "--initial-branch=main"] });
  write({
    path: join(meltaUi, "package.json"),
    content: '{"name":"melta-ui","version":"0.0.0"}\n',
  });
  write({
    path: join(meltaUi, "node_modules/@modelcontextprotocol/sdk/package.json"),
    content: '{"name":"@modelcontextprotocol/sdk"}\n',
  });
  write({
    path: join(meltaUi, "src/index.ts"),
    content: "export const ok = true;\n",
  });
  if (!trackDist) {
    write({ path: join(meltaUi, ".gitignore"), content: "dist/\n" });
  }
  write({
    path: join(meltaUi, "dist/index.js"),
    content: "process.stdout.write('melta-ui');\n",
  });
  git({ cwd: meltaUi, args: ["add", "-A"] });
  git({ cwd: meltaUi, args: ["commit", "-m", "melta-ui"] });
  return git({ cwd: meltaUi, args: ["rev-parse", "HEAD"] });
}

function createFixture({
  trackDist = true,
}: {
  trackDist?: boolean;
} = {}): Fixture {
  const tmp = mkdtempSync(join(tmpdir(), "pdcxa-ensure-"));
  const primary = join(tmp, "primary");
  mkdirSync(join(primary, "scripts"), { recursive: true });
  git({ cwd: primary, args: ["init", "--initial-branch=main"] });
  spawnSync("cp", [scriptSource, join(primary, "scripts/ensure-melta-ui.sh")]);

  const meltaUiSha = buildMeltaUiRepo({ primary, trackDist });
  git({ cwd: primary, args: ["add", "scripts/ensure-melta-ui.sh"] });
  git({
    cwd: primary,
    args: [
      "update-index",
      "--add",
      "--cacheinfo",
      `160000,${meltaUiSha},melta-ui`,
    ],
  });
  git({ cwd: primary, args: ["commit", "-m", "root"] });

  const worktree = join(tmp, "worktree");
  git({
    cwd: primary,
    args: ["worktree", "add", "--detach", worktree, "HEAD"],
  });

  fixture = { tmp, primary, worktree };
  return fixture;
}

function advancePrimaryMeltaUi(): void {
  const meltaUi = join(current().primary, "melta-ui");
  write({ path: join(meltaUi, "extra.txt"), content: "moved on\n" });
  git({ cwd: meltaUi, args: ["add", "-A"] });
  git({ cwd: meltaUi, args: ["commit", "-m", "advance"] });
}

function recordUpstreamOnlyMeltaUi(): void {
  const { tmp, primary, worktree } = current();
  const meltaUi = join(primary, "melta-ui");
  const upstream = join(tmp, "upstream");
  git({ cwd: tmp, args: ["clone", "--quiet", meltaUi, upstream] });
  write({ path: join(upstream, "upstream.txt"), content: "released\n" });
  git({ cwd: upstream, args: ["add", "-A"] });
  git({ cwd: upstream, args: ["commit", "-m", "release"] });
  const released = git({ cwd: upstream, args: ["rev-parse", "HEAD"] });
  git({ cwd: meltaUi, args: ["remote", "add", "origin", upstream] });
  git({
    cwd: worktree,
    args: ["update-index", "--cacheinfo", `160000,${released},melta-ui`],
  });
  git({ cwd: worktree, args: ["commit", "-m", "bump melta-ui"] });
}

function stubBun(): string {
  const stubBin = join(current().tmp, "stub-bin");
  write({ path: join(stubBin, "bun"), content: "#!/bin/sh\nexit 0\n" });
  spawnSync("chmod", ["+x", join(stubBin, "bun")]);
  return `${stubBin}:${process.env.PATH}`;
}

function runEnsure(env: Record<string, string> = {}): {
  status: number | null;
  stdout: string;
} {
  const { tmp, worktree } = current();
  const result = spawnSync(join(worktree, "scripts/ensure-melta-ui.sh"), [], {
    cwd: worktree,
    encoding: "utf8",
    env: {
      ...process.env,
      TMPDIR: tmp,
      PDCXA_SETUP_LOG: join(tmp, "setup.log"),
      ...env,
    },
  });
  return { status: result.status, stdout: result.stdout.trim() };
}

function lockPath(): string {
  const { tmp, worktree } = current();
  const hasher = spawnSync("sha256sum", [], {
    input: worktree,
    encoding: "utf8",
  });
  const digest =
    hasher.status === 0
      ? hasher.stdout
      : spawnSync("shasum", ["-a", "256"], {
          input: worktree,
          encoding: "utf8",
        }).stdout;
  return join(tmp, `pdcxa-melta-ui-${digest.slice(0, 16)}.lock`);
}

function holdLock(pid: string): void {
  const lock = lockPath();
  mkdirSync(lock, { recursive: true });
  writeFileSync(join(lock, "pid"), pid);
}

afterEach(() => {
  if (fixture) {
    rmSync(fixture.tmp, { recursive: true, force: true });
    fixture = undefined;
  }
});

test("未展開の worktree では primary の melta-ui を複製し、gitdir を残さない", () => {
  createFixture();

  const { status, stdout } = runEnsure();

  expect(status).toBe(0);
  expect(stdout).toBe("copied");
  expect(existsSync(wt("melta-ui/.git"))).toBe(false);
});

test("複製が完了した worktree には準備完了マーカーが残る", () => {
  createFixture();

  runEnsure();

  expect(existsSync(wt(readyMarker))).toBe(true);
  expect(existsSync(wt("melta-ui/package.json"))).toBe(true);
  expect(
    existsSync(wt("melta-ui/node_modules/@modelcontextprotocol/sdk")),
  ).toBe(true);
});

test("中断で dist だけ残ったツリーは準備完了とみなさず作り直す", () => {
  createFixture();
  write({ path: wt("melta-ui/dist/index.js"), content: "// truncated copy\n" });

  const { status, stdout } = runEnsure();

  expect(status).toBe(0);
  expect(stdout).not.toBe("present");
  expect(existsSync(wt("melta-ui/package.json"))).toBe(true);
});

test("マーカーだけ失った完成済みツリーは作り直さず準備完了に戻す", () => {
  createFixture();
  runEnsure();
  rmSync(wt(readyMarker));

  const { status, stdout } = runEnsure();

  expect(status).toBe(0);
  expect(stdout).toBe("present");
  expect(existsSync(wt(readyMarker))).toBe(true);
});

test("死んだプロセスが残した排他は奪って複製を続行する", () => {
  createFixture();
  holdLock("4194304");

  const { status, stdout } = runEnsure({ PDCXA_MELTA_LOCK_TIMEOUT: "60" });

  expect(status).toBe(0);
  expect(stdout).toBe("copied");
}, 90_000);

test("生きたプロセスが排他を保持している間は複製せず失敗する", () => {
  createFixture();
  holdLock(String(process.pid));

  const { status } = runEnsure({ PDCXA_MELTA_LOCK_TIMEOUT: "2" });

  expect(status).toBe(1);
  expect(existsSync(wt("melta-ui/dist/index.js"))).toBe(false);
}, 30_000);

test("複製だけを許す呼び出しでは、primary が記録された版と違えば失敗する", () => {
  createFixture();
  advancePrimaryMeltaUi();

  const { status } = runEnsure({ PDCXA_MELTA_COPY_ONLY: "1" });

  expect(status).toBe(1);
  expect(existsSync(wt("melta-ui/dist/index.js"))).toBe(false);
});

test("記録された版を展開してもビルドが成果物を出さなければ失敗する", () => {
  createFixture({ trackDist: false });
  advancePrimaryMeltaUi();

  const { status } = runEnsure({ PATH: stubBun() });

  expect(status).toBe(1);
  expect(existsSync(wt(readyMarker))).toBe(false);
}, 30_000);

test("記録された版が primary にまだ無ければ、上流から取得して展開する", () => {
  createFixture();
  recordUpstreamOnlyMeltaUi();

  const { status, stdout } = runEnsure({ PATH: stubBun() });

  expect({ status, stdout }).toEqual({ status: 0, stdout: "built" });
  expect(existsSync(wt("melta-ui/upstream.txt"))).toBe(true);
}, 30_000);

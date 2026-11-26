// 更新時: フィクスチャを意図的に変えたら `bun run test -u biome-plugins/testing` で再生成。

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { beforeAll, describe, expect, it } from "vitest";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, "../../../..");
const fixturesDir = join(here, "__fixtures__");
const biomeBin = [
  join(repoRoot, "node_modules/.bin/biome"),
  join(here, "../../node_modules/.bin/biome"),
].find(existsSync);

const テストファイル向けか = (includes: readonly string[]): boolean =>
  includes.some((glob) => glob.includes(".test.") || glob.includes(".spec."));
const フィクスチャ = ["**/__fixtures__/**"];

function buildConfigFromReal(): string {
  const real = JSON.parse(
    readFileSync(join(repoRoot, "biome.json"), "utf8"),
  ) as {
    $schema: string;
    plugins: Array<{ path: string; includes: string[] }>;
    overrides?: Array<{ includes: string[]; linter: unknown }>;
  };
  const generated = {
    $schema: real.$schema,
    linter: { enabled: true, rules: { recommended: false } },
    plugins: real.plugins
      .filter((p) => p.path.includes("/testing/"))
      .map((p) => ({ path: join(repoRoot, p.path), includes: フィクスチャ })),
    overrides: (real.overrides ?? [])
      .filter((o) => テストファイル向けか(o.includes))
      .map((o) => ({ ...o, includes: フィクスチャ })),
  };
  const out = join(tmpdir(), "test-antipatterns.fixtures.biome.json");
  writeFileSync(out, JSON.stringify(generated, null, 2));
  return out;
}

type Entry = { file: string; line: number; category: string; message: string };

function lintFixtures(): Entry[] {
  if (!biomeBin) throw new Error("biome バイナリが見つからない");
  let stdout = "";
  try {
    stdout = execFileSync(
      biomeBin,
      [
        "lint",
        "--reporter=json",
        `--config-path=${buildConfigFromReal()}`,
        fixturesDir,
      ],
      { encoding: "utf8" },
    );
  } catch (err) {
    stdout = (err as { stdout?: Buffer | string }).stdout?.toString() ?? "";
  }
  const report = JSON.parse(stdout) as {
    diagnostics?: Array<{
      category: string;
      message: string;
      location: { path: string; start: { line: number } };
    }>;
  };
  return (report.diagnostics ?? []).map((d) => ({
    file: relative(fixturesDir, d.location.path).split("\\").join("/"),
    line: d.location.start.line,
    category: d.category,
    message: d.message,
  }));
}

let all: Entry[];
beforeAll(() => {
  all = lintFixtures();
});

const lines = (file: string): string[] =>
  all
    .filter((e) => e.file === file)
    .sort(
      (a, b) =>
        a.line - b.line ||
        a.category.localeCompare(b.category) ||
        a.message.localeCompare(b.message),
    )
    .map((e) => `L${e.line} [${e.category}] ${e.message}`);

describe("テストのアンチパターン Linter の発火を pin する", () => {
  it("biome が実際に走り診断を返している（false green ガード）", () => {
    expect(all.length).toBeGreaterThan(0);
  });

  it("期待値の計算・expect の中の分岐・弱い比べ方・実時間の待ち・await の無い rejects が発火する", () => {
    expect(lines("violations.ts")).toMatchInlineSnapshot(`
      [
        "L11 [plugin] 期待値を計算で作らない: 実装と同じ式を期待値に書くと、式が間違っていてもテストが通る。手で求めた答えをリテラルで書く。",
        "L12 [plugin] 期待値を計算で作らない: 実装と同じ式を期待値に書くと、式が間違っていてもテストが通る。手で求めた答えをリテラルで書く。",
        "L13 [plugin] 期待値を計算で作らない: 実装と同じ式を期待値に書くと、式が間違っていてもテストが通る。手で求めた答えをリテラルで書く。",
        "L14 [plugin] expect の中で分岐しない: 条件が外れた側の値（-1・空文字・false）でも一致してしまい、何を確かめたかが読めない。値を取り出してから、取り出した値に期待する形を書く。",
        "L15 [plugin] expect の中で分岐しない: 条件が外れた側の値（-1・空文字・false）でも一致してしまい、何を確かめたかが読めない。値を取り出してから、取り出した値に期待する形を書く。",
        "L16 [plugin] 件数は toHaveLength で比べる: .length を toBe で比べると、失敗したとき中身が出ず何が余った・欠けたかが分からない。",
        "L17 [plugin] 含むかは toContain で比べる: includes を true / false と比べると、失敗したとき中身が出ない。否定は not.toContain を使う。",
        "L18 [plugin] 比較の結果を true / false と比べない: 失敗したとき両辺の値が出ない。expect(左辺).toBe(右辺) で書く。",
        "L19 [plugin] 文字列にしてから比べない: キーの順番が違うだけで落ち、失敗したとき差分が読めない。toEqual でオブジェクトのまま比べる。",
        "L20 [plugin] 同じ値どうしを比べない: 常に通るので何も確かめていない。",
        "L21 [plugin] リテラルを expect に渡さない: 結果が書いた時点で決まっていて、テスト対象の振る舞いを何も確かめていない。",
        "L22 [plugin] テストで実時間を待たない: 遅いうえに、CI の負荷で間に合わず落ちる。vi.useFakeTimers / Effect の TestClock で時間を進めるか、待つ条件を waitFor で書く。",
        "L23 [plugin] テストで実時間を待たない: 遅いうえに、CI の負荷で間に合わず落ちる。vi.useFakeTimers / Effect の TestClock で時間を進めるか、待つ条件を waitFor で書く。",
        "L24 [plugin] テストで as unknown as を使わない: 型が合わない偽物を本物として渡すと、実際の形と食い違っても気づけない。使う欄だけの interface を受け取るよう本体を直すか、型どおりの値を組む。",
        "L26 [plugin] rejects / resolves は await する: await しないとテストが先に終わり、失敗しても通ってしまう。",
        "L27 [plugin] rejects / resolves は await する: await しないとテストが先に終わり、失敗しても通ってしまう。",
        "L28 [plugin] expect の中で分岐しない: 条件が外れた側の値（-1・空文字・false）でも一致してしまい、何を確かめたかが読めない。値を取り出してから、取り出した値に期待する形を書く。",
        "L29 [plugin] 件数は toHaveLength で比べる: .length を toBe で比べると、失敗したとき中身が出ず何が余った・欠けたかが分からない。",
        "L30 [plugin] 含むかは toContain で比べる: includes を true / false と比べると、失敗したとき中身が出ない。否定は not.toContain を使う。",
        "L31 [plugin] 比較の結果を true / false と比べない: 失敗したとき両辺の値が出ない。expect(左辺).toBe(右辺) で書く。",
        "L32 [plugin] 期待値を計算で作らない: 実装と同じ式を期待値に書くと、式が間違っていてもテストが通る。手で求めた答えをリテラルで書く。",
        "L33 [plugin] 文字列にしてから比べない: キーの順番が違うだけで落ち、失敗したとき差分が読めない。toEqual でオブジェクトのまま比べる。",
        "L34 [plugin] テストで実時間を待たない: 遅いうえに、CI の負荷で間に合わず落ちる。vi.useFakeTimers / Effect の TestClock で時間を進めるか、待つ条件を waitFor で書く。",
        "L36 [plugin] テストで実時間を待たない: 遅いうえに、CI の負荷で間に合わず落ちる。vi.useFakeTimers / Effect の TestClock で時間を進めるか、待つ条件を waitFor で書く。",
        "L38 [plugin] expect の中で分岐しない: 条件が外れた側の値（-1・空文字・false）でも一致してしまい、何を確かめたかが読めない。値を取り出してから、取り出した値に期待する形を書く。",
        "L39 [plugin] 件数は toHaveLength で比べる: .length を toBe で比べると、失敗したとき中身が出ず何が余った・欠けたかが分からない。",
      ]
    `);
  });

  it("条件の中の expect・同じ名前のテスト・skip・expect の無いテストが発火する", () => {
    expect(lines("builtin-violations.ts")).toMatchInlineSnapshot(`
      [
        "L8 [lint/suspicious/noConditionalExpect] Unexpected conditional expect() call.",
        "L12 [lint/suspicious/noIdenticalTestTitle] The test title "同じ名前" is used more than once in the same scope.",
        "L20 [lint/suspicious/noSkippedTests] Don't disable tests.",
        "L20 [lint/suspicious/useExpect] Test callback is missing an expect() assertion.",
        "L22 [lint/suspicious/useExpect] Test callback is missing an expect() assertion.",
      ]
    `);
  });

  it("リテラルの期待値・toHaveLength・toContain・await した rejects・決定性の確認は発火しない", () => {
    expect(lines("clean.ts")).toEqual([]);
  });
});

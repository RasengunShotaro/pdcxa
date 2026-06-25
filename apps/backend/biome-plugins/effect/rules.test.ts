// Effect-TS オニオン Linter の characterization test（learning test）。
// __fixtures__/ の意図的違反・clean サンプルに「本物の biome.json から生成した config」を
// 当て、診断（どのファイルの何行に何が出るか）を inline snapshot で pin する。
//
// 単一の真実: テスト用 config は biome.json を写経せず、実 config の plugins(grit) と
// overrides(rule C) を読み、includes の scope だけを backend/src → __fixtures__ に
// 付け替えて生成する。よって実 config の rule A/B/C/D を壊す（grit 改変・rule C を off・
// handlers scope を外す 等）と snapshot が割れて気づける。
//
// 更新時: フィクスチャを意図的に変えたら `bun run test -u rules.test.ts` で snapshot 再生成。
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { beforeAll, describe, expect, it } from "vitest";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, "../../../..");
const fixturesDir = join(here, "__fixtures__");
const realConfigPath = join(repoRoot, "biome.json");
const biomeBin = [
  join(repoRoot, "node_modules/.bin/biome"),
  join(here, "../../node_modules/.bin/biome"),
].find(existsSync);

// 実 config の includes glob を fixtures ツリーへ付け替える（forbidden import の group は不変）。
const rescope = (globs: string[]): string[] =>
  globs.map((g) => g.replace("**/backend/src/", "**/__fixtures__/"));

// biome.json から rule A/B/D(plugins) と rule C(overrides) を読んで fixtures 用 config を生成する。
function buildConfigFromReal(): string {
  const real = JSON.parse(readFileSync(realConfigPath, "utf8")) as {
    $schema: string;
    plugins: Array<{ path: string; includes: string[] }>;
    overrides?: Array<{ includes: string[]; linter: unknown }>;
  };
  const generated = {
    $schema: real.$schema,
    linter: { enabled: true, rules: { recommended: false } },
    plugins: real.plugins.map((p) => ({
      path: join(repoRoot, p.path), // 配置非依存にするため絶対パス化
      includes: rescope(p.includes),
    })),
    overrides: (real.overrides ?? []).map((o) => ({
      ...o,
      includes: rescope(o.includes),
    })),
  };
  const out = join(tmpdir(), "effect-onion-lint.fixtures.biome.json");
  writeFileSync(out, JSON.stringify(generated, null, 2));
  return out;
}

type Entry = { file: string; line: number; category: string; message: string };

function lintFixtures(): Entry[] {
  if (!biomeBin) throw new Error("biome バイナリが見つからない");
  const config = buildConfigFromReal();
  let stdout = "";
  try {
    stdout = execFileSync(
      biomeBin,
      ["lint", "--reporter=json", `--config-path=${config}`, fixturesDir],
      { encoding: "utf8" },
    );
  } catch (err) {
    // 診断が出ると biome は非ゼロ終了する。stdout に JSON は載っている。
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

describe("Effect-TS オニオン Linter の発火を pin する", () => {
  it("biome が実際に走り診断を返している（false green ガード）", () => {
    expect(all.length).toBeGreaterThan(0);
  });

  it("rule A: 危険メソッドは全層で発火し、代替(matchEffect/matchCause/catchTag/runPromise)は発火しない", () => {
    expect(lines("banned-everywhere.ts")).toMatchInlineSnapshot(`
      [
        "L9 [plugin] Effect.sync は禁止: throw が defect 化して型付きエラーに乗らない。throw しうるなら Effect.try({ try, catch }) を使う。",
        "L10 [plugin] Effect.promise は禁止: reject が defect 化して型に乗らない。Effect.tryPromise({ try, catch }) を使う。",
        "L11 [plugin] Effect.runSync は禁止: 非同期混入で実行時に例外を投げる。Effect.runPromise を使う。",
        "L12 [plugin] Effect.match は禁止: 分岐の副作用・依存(R) が Effect の外に逃げる。Effect.matchEffect を使う。",
        "L13 [plugin] Effect.catchIf は禁止: エラー型が narrowing されず E から消えない。Effect.catchTag / catchTags を使う。",
      ]
    `);
  });

  it("rule B(domain) + rule C: Layer/provide/run/生IO と越境 import が発火する", () => {
    expect(lines("domain/violations.ts")).toMatchInlineSnapshot(`
      [
        "L4 [lint/style/noRestrictedImports] domain 層は他層を import 禁止(最内・内向き依存のみ)。domain は何にも依存しない。",
        "L10 [plugin] domain / service 層では Layer.* は禁止: 実装を持たせない。Layer の構築は infra 層へ。",
        "L11 [plugin] domain / service 層では Effect.provide* / Effect.run* は禁止: R を開けたまま要求するだけにする。注入・実行は handler(合成ルート)へ。",
        "L12 [plugin] domain / service 層では Effect.provide* / Effect.run* は禁止: R を開けたまま要求するだけにする。注入・実行は handler(合成ルート)へ。",
        "L13 [plugin] domain / service 層では生 IO 構築子(try / tryPromise / acquireRelease)は禁止: IO は infra のポート越しに呼ぶ。",
        "L14 [plugin] domain / service 層では生 IO 構築子(try / tryPromise / acquireRelease)は禁止: IO は infra のポート越しに呼ぶ。",
      ]
    `);
  });

  it("domain clean: Context.Tag/Schema/gen/fail/型注釈の Layer 参照は発火しない", () => {
    expect(lines("domain/clean.ts")).toEqual([]);
  });

  it("rule B(infra) + rule C: provide/run と service import が発火し、Layer.*/生IO/Context.Tag は発火しない", () => {
    expect(lines("infrastructure/violations.ts")).toMatchInlineSnapshot(`
      [
        "L5 [lint/style/noRestrictedImports] infra 層が import してよいのは domain のみ。service / route / handler への依存は禁止(内向き依存のみ)。",
        "L11 [plugin] infra 層では Effect.provide* / Effect.run* は禁止: 配線・実行は handler(合成ルート)へ。infra は実装専任。",
        "L12 [plugin] infra 層では Effect.provide* / Effect.run* は禁止: 配線・実行は handler(合成ルート)へ。infra は実装専任。",
      ]
    `);
  });

  it("rule A + rule B(service) + rule C: 危険メソッド・Layer/provide/run/生IO・infra import が発火する", () => {
    expect(lines("services/violations.ts")).toMatchInlineSnapshot(`
      [
        "L4 [lint/style/noRestrictedImports] service 層は infra を import 禁止: 依存先は domain の Tag のみ。実装(infra)を知ってはいけない。",
        "L10 [plugin] Effect.sync は禁止: throw が defect 化して型付きエラーに乗らない。throw しうるなら Effect.try({ try, catch }) を使う。",
        "L13 [plugin] domain / service 層では Layer.* は禁止: 実装を持たせない。Layer の構築は infra 層へ。",
        "L14 [plugin] domain / service 層では Effect.provide* / Effect.run* は禁止: R を開けたまま要求するだけにする。注入・実行は handler(合成ルート)へ。",
        "L15 [plugin] domain / service 層では Effect.provide* / Effect.run* は禁止: R を開けたまま要求するだけにする。注入・実行は handler(合成ルート)へ。",
        "L16 [plugin] domain / service 層では生 IO 構築子(try / tryPromise / acquireRelease)は禁止: IO は infra のポート越しに呼ぶ。",
      ]
    `);
  });

  it("rule D(routes): リクエストパス内の provide(Layer.mergeAll(...)) が発火し、単一 layer の provide/run は発火しない", () => {
    expect(lines("routes/violations.ts")).toMatchInlineSnapshot(`
      [
        "L11 [plugin] リクエストパス内で Layer.mergeAll(...) を provide するのは禁止: 毎回 Layer 再構築でメモ化が無効化する。起動時に AppLive を ManagedRuntime 化し共有 Runtime で実行する。",
        "L12 [plugin] リクエストパス内で Layer.mergeAll(...) を provide するのは禁止: 毎回 Layer 再構築でメモ化が無効化する。起動時に AppLive を ManagedRuntime 化し共有 Runtime で実行する。",
      ]
    `);
  });

  it("rule D(handlers): handlers 層でも provide(Layer.mergeAll(...)) が発火する（scope の pin）", () => {
    expect(lines("handlers/violations.ts")).toMatchInlineSnapshot(`
      [
        "L10 [plugin] リクエストパス内で Layer.mergeAll(...) を provide するのは禁止: 毎回 Layer 再構築でメモ化が無効化する。起動時に AppLive を ManagedRuntime 化し共有 Runtime で実行する。",
      ]
    `);
  });

  it("テスト除外: *.test.ts は全ルールの対象外（発火しない）", () => {
    expect(lines("services/skipped.test.ts")).toEqual([]);
  });
});

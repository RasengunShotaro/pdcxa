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

  it("rule A: 危険メソッド・型の無い失敗・失敗を見ない catch は全層で発火し、代替(matchEffect/matchCause/catchTag/runPromise/error を読む catch)は発火しない", () => {
    expect(lines("banned-everywhere.ts")).toMatchInlineSnapshot(`
      [
        "L9 [plugin] Effect.sync は禁止: throw が defect 化して型付きエラーに乗らない。throw しうるなら Effect.try({ try, catch }) を使う。",
        "L10 [plugin] Effect.promise は禁止: reject が defect 化して型に乗らない。Effect.tryPromise({ try, catch }) を使う。",
        "L11 [plugin] Effect.runSync は禁止: 非同期混入で実行時に例外を投げる。Effect.runPromise を使う。",
        "L12 [plugin] Effect.match は禁止: 分岐の副作用・依存(R) が Effect の外に逃げる。Effect.matchEffect を使う。",
        "L13 [plugin] Effect.catchIf は禁止: エラー型が narrowing されず E から消えない。Effect.catchTag / catchTags を使う。",
        "L18 [plugin] Effect.fail に文字列や素の Error を渡さない: catchTag で拾えず、失敗の種類が型に残らない。Data.TaggedError で失敗を定義して渡す。",
        "L19 [plugin] Effect.fail に文字列や素の Error を渡さない: catchTag で拾えず、失敗の種類が型に残らない。Data.TaggedError で失敗を定義して渡す。",
        "L20 [plugin] 失敗を見ずに握り潰さない: 想定する失敗だけ catchTag で拾うか、受け取った error をログに残してから代わりの値にする。読めなかったことを「無い」「成功」に畳まない。",
        "L21 [plugin] 失敗を見ずに握り潰さない: 想定する失敗だけ catchTag で拾うか、受け取った error をログに残してから代わりの値にする。読めなかったことを「無い」「成功」に畳まない。",
        "L22 [plugin] 失敗を見ずに握り潰さない: 想定する失敗だけ catchTag で拾うか、受け取った error をログに残してから代わりの値にする。読めなかったことを「無い」「成功」に畳まない。",
      ]
    `);
  });

  it("rule A + rule B(domain) + rule C + rule G: Layer/provide/run/生IO・越境 import・Effect の手続き・文字列の失敗が発火する", () => {
    expect(lines("domain/violations.ts")).toMatchInlineSnapshot(`
      [
        "L4 [lint/style/noRestrictedImports] domain 層は他層を import 禁止(最内・内向き依存のみ)。domain は何にも依存しない。",
        "L10 [plugin] domain / service 層では Layer.* は禁止: 実装を持たせない。Layer の構築は infra 層へ。",
        "L11 [plugin] domain / service 層では Effect.provide* / Effect.run* は禁止: R を開けたまま要求するだけにする。注入・実行は handler(合成ルート)へ。",
        "L12 [plugin] domain / service 層では Effect.provide* / Effect.run* は禁止: R を開けたまま要求するだけにする。注入・実行は handler(合成ルート)へ。",
        "L13 [plugin] domain / service 層では生 IO 構築子(try / tryPromise / acquire 系)は禁止: IO は infra のポート越しに呼ぶ。",
        "L14 [plugin] domain / service 層では生 IO 構築子(try / tryPromise / acquire 系)は禁止: IO は infra のポート越しに呼ぶ。",
        "L16 [plugin] domain / service 層では throw は禁止: 呼び出し元が Effect なら defect 化して型付きエラーに乗らず catchTag で拾えない。純関数は null / 判別可能な戻り値を返し、Effect 内は Effect.fail を使う。",
        "L21 [plugin] domain 層では Effect.gen / Effect.fn を書かない: domain は型・ポート・純関数だけにする。ポートを呼ぶ手続きは services のユースケースへ、判断は値を受け取って返す純関数にする。",
        "L24 [plugin] Effect.fail に文字列や素の Error を渡さない: catchTag で拾えず、失敗の種類が型に残らない。Data.TaggedError で失敗を定義して渡す。",
        "L25 [plugin] domain / service 層では生 IO 構築子(try / tryPromise / acquire 系)は禁止: IO は infra のポート越しに呼ぶ。",
      ]
    `);
  });

  it("domain clean: Context.Service/Schema/型注釈の Layer 参照・状態の述語・時刻を受け取る純関数・Tagged Error の失敗は発火しない", () => {
    expect(lines("domain/clean.ts")).toEqual([]);
  });

  it("rule B(infra) + rule C: provide/run と service import が発火し、Layer.*/生IO/Context.Service は発火しない", () => {
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
        "L16 [plugin] domain / service 層では生 IO 構築子(try / tryPromise / acquire 系)は禁止: IO は infra のポート越しに呼ぶ。",
        "L18 [plugin] domain / service 層では throw は禁止: 呼び出し元が Effect なら defect 化して型付きエラーに乗らず catchTag で拾えない。純関数は null / 判別可能な戻り値を返し、Effect 内は Effect.fail を使う。",
      ]
    `);
  });

  it("rule D(routes): リクエストパス内の provide(Layer.mergeAll(...)) が発火し、単一 layer の provide/run は発火しない", () => {
    expect(lines("routes/violations.ts")).toMatchInlineSnapshot(`
      [
        "L11 [plugin] リクエストパス内で Layer.mergeAll(...) を provide するのは禁止: 毎回 Layer 再構築でメモ化が無効化する。起動時に AppLive を ManagedRuntime.make で一度だけ組み、runtime.runPromise で実行する。",
        "L12 [plugin] リクエストパス内で Layer.mergeAll(...) を provide するのは禁止: 毎回 Layer 再構築でメモ化が無効化する。起動時に AppLive を ManagedRuntime.make で一度だけ組み、runtime.runPromise で実行する。",
      ]
    `);
  });

  it("rule D(handlers): handlers 層でも provide(Layer.mergeAll(...)) が発火する（scope の pin）", () => {
    expect(lines("handlers/violations.ts")).toMatchInlineSnapshot(`
      [
        "L10 [plugin] リクエストパス内で Layer.mergeAll(...) を provide するのは禁止: 毎回 Layer 再構築でメモ化が無効化する。起動時に AppLive を ManagedRuntime.make で一度だけ組み、runtime.runPromise で実行する。",
      ]
    `);
  });

  it("rule E: 遅延開始に任せた forkChild・文字列の die・_tag を照合する toMatchObject が発火する", () => {
    expect(lines("v4-pitfalls.ts")).toMatchInlineSnapshot(`
      [
        "L12 [plugin] Effect.forkChild は開始の仕方を明示する: v4 は既定で遅延開始で、親が先に失敗すると子は始まらず onInterrupt も走らない。options に startImmediately: true か false を渡す。",
        "L13 [plugin] Effect.die に文字列を渡さない: v4 は文字列をそのまま defect にする（v3 の dieMessage は Error に包んでいた）。new Error で包んで渡す。",
        "L14 [plugin] Effect.die に文字列を渡さない: v4 は文字列をそのまま defect にする（v3 の dieMessage は Error に包んでいた）。new Error で包んで渡す。",
        "L15 [plugin] Result / Exit の _tag を toMatchObject で照合しない: v4 では _tag がプロトタイプ側にあり一致しない。{ failure: ... } / { success: ... } で書くか、Result.isFailure などで判定する。",
        "L16 [plugin] Result / Exit の _tag を toMatchObject で照合しない: v4 では _tag がプロトタイプ側にあり一致しない。{ failure: ... } / { success: ... } で書くか、Result.isFailure などで判定する。",
      ]
    `);
  });

  it("rule F + rule G: domain では Effect の手続き・UUID の生成・時刻の直読みが発火する", () => {
    expect(lines("domain/pure.ts")).toMatchInlineSnapshot(`
      [
        "L6 [plugin] domain 層では Effect.gen / Effect.fn を書かない: domain は型・ポート・純関数だけにする。ポートを呼ぶ手続きは services のユースケースへ、判断は値を受け取って返す純関数にする。",
        "L9 [plugin] domain 層では Effect.gen / Effect.fn を書かない: domain は型・ポート・純関数だけにする。ポートを呼ぶ手続きは services のユースケースへ、判断は値を受け取って返す純関数にする。",
        "L12 [plugin] domain 層では UUID を生成しない: 同じ入力で同じ結果を返せなくなる。id はユースケースで作って引数で渡す。",
        "L13 [plugin] domain 層では UUID を生成しない: 同じ入力で同じ結果を返せなくなる。id はユースケースで作って引数で渡す。",
        "L14 [plugin] domain / service 層では new Date() で現在時刻を読まない: テストで時刻を固定できない。Effect.gen の中は yield* DateTime.nowAsDate、純関数は現在時刻を引数で受け取る。",
        "L15 [plugin] domain / service 層では Date.now() を読まない: テストで時刻を固定できない。Effect.gen の中は yield* Clock.currentTimeMillis、純関数は現在時刻を引数で受け取る。",
      ]
    `);
  });

  it("rule F + rule H: service では status の文字列比較・switch と時刻・乱数・環境・標準出力・生の通信が発火し、domain の述語・Clock・status 以外の比較は発火しない", () => {
    expect(lines("services/application-service.ts")).toMatchInlineSnapshot(`
      [
        "L11 [plugin] service 層で status を文字列と比べない: 状態の意味（何ができる・済んでいるか）は domain の述語に置く。例: 削除できる巡回か(patrol)。",
        "L12 [plugin] service 層で status を文字列と比べない: 状態の意味（何ができる・済んでいるか）は domain の述語に置く。例: 削除できる巡回か(patrol)。",
        "L14 [plugin] service 層で status を switch しない: 状態ごとの振る舞いは domain の関数に置く。",
        "L21 [plugin] service 層で status を文字列と比べない: 状態の意味（何ができる・済んでいるか）は domain の述語に置く。例: 削除できる巡回か(patrol)。",
        "L22 [plugin] service 層で status を文字列と比べない: 状態の意味（何ができる・済んでいるか）は domain の述語に置く。例: 削除できる巡回か(patrol)。",
        "L23 [plugin] service 層で status を文字列と比べない: 状態の意味（何ができる・済んでいるか）は domain の述語に置く。例: 削除できる巡回か(patrol)。",
        "L24 [plugin] domain / service 層では new Date() で現在時刻を読まない: テストで時刻を固定できない。Effect.gen の中は yield* DateTime.nowAsDate、純関数は現在時刻を引数で受け取る。",
        "L25 [plugin] domain / service 層では Date.now() を読まない: テストで時刻を固定できない。Effect.gen の中は yield* Clock.currentTimeMillis、純関数は現在時刻を引数で受け取る。",
        "L26 [plugin] domain / service 層では Math.random() を使わない: テストで再現できない。Effect の Random（Random.next など）を使う。",
        "L27 [plugin] domain / service 層では process.env を読まない: 設定は lib/ の env か Config から読み、infra の Layer で閉じ込める。",
        "L28 [plugin] domain / service 層では console.* を使わない: Effect.log / logWarning / logError で残す（ログの文脈と span が付く）。",
        "L29 [plugin] domain / service 層では fetch を直接呼ばない: 外部通信は infra の実装に置き、domain のポート越しに呼ぶ。",
      ]
    `);
  });

  it("テスト除外: *.test.ts は全ルールの対象外（発火しない）", () => {
    expect(lines("services/skipped.test.ts")).toEqual([]);
  });
});

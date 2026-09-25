import { describe, expect, test } from "bun:test";
import { globToRegExp, parseRulePaths, rulesForPath } from "./path-rules.mjs";

const フロントマターつきルール = (paths) =>
  `---\npaths:\n${paths.map((p) => `  - "${p}"`).join("\n")}\n---\n\n# rule body\n`;

describe("parseRulePaths", () => {
  test("frontmatter の paths を取り出す", () => {
    const content = フロントマターつきルール(["backend/**/*.ts", "**/*.tsx"]);

    expect(parseRulePaths(content)).toEqual(["backend/**/*.ts", "**/*.tsx"]);
  });

  test("frontmatter が無いルールは常時ロード扱いで空配列", () => {
    expect(parseRulePaths("# コーディングスタイル\n\n本文\n")).toEqual([]);
  });

  test("frontmatter はあるが paths が無いルールは空配列", () => {
    expect(parseRulePaths("---\nname: foo\n---\n\n本文\n")).toEqual([]);
  });

  test("クォート無し・シングルクォートの両方を読む", () => {
    const content =
      "---\npaths:\n  - backend/**/*.ts\n  - 'infra/**/*.ts'\n---\n";

    expect(parseRulePaths(content)).toEqual([
      "backend/**/*.ts",
      "infra/**/*.ts",
    ]);
  });

  test("本文中の paths: らしき行を frontmatter と誤読しない", () => {
    const content = "# 本文\n\npaths:\n  - なにか\n";

    expect(parseRulePaths(content)).toEqual([]);
  });
});

describe("globToRegExp", () => {
  test("**/ は 0 個以上のディレクトリにマッチする", () => {
    const re = globToRegExp("**/*.ts");

    expect(re.test("env.ts")).toBe(true);
    expect(re.test("backend/src/lib/env.ts")).toBe(true);
    expect(re.test("backend/src/lib/env.tsx")).toBe(false);
  });

  test("接頭辞つきの ** はそのディレクトリ配下だけにマッチする", () => {
    const re = globToRegExp("backend/**/*.ts");

    expect(re.test("backend/src/x.ts")).toBe(true);
    expect(re.test("backend/x.ts")).toBe(true);
    expect(re.test("frontend/src/x.ts")).toBe(false);
  });

  test("* はディレクトリ境界を越えない", () => {
    const re = globToRegExp("frontend/components/*.tsx");

    expect(re.test("frontend/components/Button.tsx")).toBe(true);
    expect(re.test("frontend/components/ui/Button.tsx")).toBe(false);
  });

  test("brace 展開を交替として扱う", () => {
    const re = globToRegExp("src/**/*.{ts,tsx}");

    expect(re.test("src/a/b.ts")).toBe(true);
    expect(re.test("src/a/b.tsx")).toBe(true);
    expect(re.test("src/a/b.js")).toBe(false);
  });

  test("ドットを任意文字として扱わない", () => {
    const re = globToRegExp("*.md");

    expect(re.test("README.md")).toBe(true);
    expect(re.test("READMExmd")).toBe(false);
  });
});

describe("rulesForPath", () => {
  const rules = [
    { path: "common/coding-style.md", globs: [] },
    { path: "backend/effect.md", globs: ["backend/**/*.ts"] },
    { path: "react/melta-ui.md", globs: ["frontend/**/*.tsx"] },
    { path: "typescript/coding-style.md", globs: ["**/*.ts", "**/*.tsx"] },
  ];

  test("マッチした path-scoped rule だけを返す", () => {
    const matched = rulesForPath({ relativePath: "backend/src/x.ts", rules });

    expect(matched.map((rule) => rule.path)).toEqual([
      "backend/effect.md",
      "typescript/coding-style.md",
    ]);
  });

  test("常時ロードのルールは hook の注入対象に含めない", () => {
    const matched = rulesForPath({ relativePath: "backend/src/x.ts", rules });

    expect(matched.map((rule) => rule.path)).not.toContain(
      "common/coding-style.md",
    );
  });

  test("どれにもマッチしなければ空", () => {
    expect(rulesForPath({ relativePath: "README.md", rules })).toEqual([]);
  });
});

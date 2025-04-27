import { describe, expect, it } from "vitest";
import { generateBreadcrumbs } from "./generate-bread-crumbs";

describe("パンくずリストの生成", () => {
  it("静的パスのページにアクセスした場合、対象ページに至るパンくずリストが返ってくる", () => {
    const path = "/profile";

    const result = generateBreadcrumbs(path);

    expect(result).toEqual([
      { href: "/", label: "ホーム" },
      { href: "/profile", label: "プロフィール" },
    ]);
  });

  it("PD詳細のページにアクセスした場合、'ホーム/PD詳細'ラベルが返ってくる", () => {
    const path = "/pd/123";

    const result = generateBreadcrumbs(path);

    expect(result).toEqual([
      { href: "/", label: "ホーム" },
      { href: "/pd/123", label: "PD詳細" },
    ]);
  });

  it("存在しないパスのページにアクセスした場合、パスのセグメントがラベルとして返ってくる", () => {
    const path = "/unknown/path";

    const result = generateBreadcrumbs(path);

    expect(result).toEqual([
      { href: "/", label: "ホーム" },
      { href: "/unknown", label: "unknown" },
      { href: "/unknown/path", label: "path" },
    ]);
  });
});

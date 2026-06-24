import { describe, expect, it } from "vitest";
import { isNavItemActive } from "./nav-items";

describe("ナビ項目が現在地かどうかを判定する", () => {
  it("ホームではホームを現在地として示す", () => {
    expect(isNavItemActive({ pathname: "/", href: "/" })).toBe(true);
  });

  it("ホーム以外のページではホームを現在地として示さない", () => {
    expect(isNavItemActive({ pathname: "/stats", href: "/" })).toBe(false);
  });

  it("パスが一致するページを現在地として示す", () => {
    expect(isNavItemActive({ pathname: "/stats", href: "/stats" })).toBe(true);
  });

  it("配下の詳細ページでも親ナビを現在地として示す", () => {
    expect(isNavItemActive({ pathname: "/stats/2024", href: "/stats" })).toBe(
      true,
    );
  });

  it("接頭辞だけ一致する別ページは現在地として示さない", () => {
    expect(isNavItemActive({ pathname: "/statsx", href: "/stats" })).toBe(
      false,
    );
  });
});

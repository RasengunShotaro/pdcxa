import { describe, expect, it } from "vitest";
import { isNavItemActive, NAV_ITEMS, pageLabelForPath } from "./nav-items";

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

describe("現在地のラベルを解決する", () => {
  it("ナビ項目のページではその項目名を返す", () => {
    expect(pageLabelForPath("/stats")).toBe("統計");
  });

  it("ホームではホームを返す", () => {
    expect(pageLabelForPath("/")).toBe("ホーム");
  });

  it("PD 詳細ページではPD詳細を返す", () => {
    expect(pageLabelForPath("/pd/abc")).toBe("PD詳細");
  });

  it("他ユーザーのページではユーザーを返す", () => {
    expect(pageLabelForPath("/user/taro")).toBe("ユーザー");
  });

  it("どのページにも該当しないパスではラベルを返さない", () => {
    expect(pageLabelForPath("/unknown")).toBeUndefined();
  });

  it("プロフィールページではプロフィールを返す", () => {
    expect(pageLabelForPath("/profile")).toBe("プロフィール");
  });
});

describe("サイドバーのナビ項目", () => {
  it("プロフィールはサイドバーのナビ項目に含めない", () => {
    expect(NAV_ITEMS.some((item) => item.href === "/profile")).toBe(false);
  });
});

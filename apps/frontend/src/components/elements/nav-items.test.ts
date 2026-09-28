import { describe, expect, it } from "vitest";
import {
  isNavItemActive,
  NAV_ITEMS,
  pageLabelForPath,
  TIMELINE_TABS,
  タブを切り替える向き,
} from "./nav-items";

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

  it("保存した PD のページでは保存した PD を返す", () => {
    expect(pageLabelForPath("/bookmarks")).toBe("保存した PD");
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
  it("プロフィールへはサイドバーから直接進める", () => {
    expect(NAV_ITEMS.some((item) => item.href === "/profile")).toBe(true);
  });
});

describe("タブを切り替える向きを決める", () => {
  it("右にあるタブへ移るときは右から入る向きにする", () => {
    expect(
      タブを切り替える向き({
        tabs: TIMELINE_TABS,
        pathname: "/",
        href: "/notifications",
      }),
    ).toBe("tab-forward");
  });

  it("左にあるタブへ移るときは左から入る向きにする", () => {
    expect(
      タブを切り替える向き({
        tabs: TIMELINE_TABS,
        pathname: "/notifications",
        href: "/",
      }),
    ).toBe("tab-back");
  });

  it("選択中のタブをもう一度押したときは動かさない", () => {
    expect(
      タブを切り替える向き({ tabs: TIMELINE_TABS, pathname: "/", href: "/" }),
    ).toBeUndefined();
  });

  it("タブに無いページから移るときは動かさない", () => {
    expect(
      タブを切り替える向き({
        tabs: TIMELINE_TABS,
        pathname: "/stats",
        href: "/notifications",
      }),
    ).toBeUndefined();
  });
});

import { describe, expect, it } from "vitest";
import {
  isNavItemActive,
  NAV_ITEMS,
  pageLabelForPath,
  TIMELINE_TABS,
  タブを切り替える向き,
  一覧に出すタブを決める,
  一覧の持ち主を求める,
  殻の見出しを決める,
  画面の種類を決める,
  開いているPDのIDを求める,
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

  it("保存済みのタブのページでは保存済みを返す", () => {
    expect(pageLabelForPath("/bookmarks")).toBe("保存済み");
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
  it("プロフィールはサイドバーに並べず、左下のユーザーメニューから開く", () => {
    expect(NAV_ITEMS.some((item) => item.href === "/profile")).toBe(false);
  });

  it("保存済みは通知と同じく、サイドバーからも開ける", () => {
    expect(NAV_ITEMS.some((item) => item.href === "/bookmarks")).toBe(true);
  });
});

describe("タイムラインのタブ", () => {
  it("ホーム・通知・保存済みの順に並ぶ", () => {
    expect(TIMELINE_TABS.map((tab) => tab.label)).toEqual([
      "ホーム",
      "通知",
      "保存済み",
    ]);
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

describe("画面の種類を決める", () => {
  it("ホームは一覧の画面として扱う", () => {
    expect(画面の種類を決める("/")).toBe("timeline");
  });

  it("保存済みは一覧の画面として扱う", () => {
    expect(画面の種類を決める("/bookmarks")).toBe("timeline");
  });

  it("PD を開いているときは詳細の画面として扱う", () => {
    expect(画面の種類を決める("/pd/abc")).toBe("detail");
  });

  it("個人のタイムラインは、その人の一覧の画面として扱う", () => {
    expect(画面の種類を決める("/user/taro")).toBe("user");
  });

  it("統計は単独のページとして扱う", () => {
    expect(画面の種類を決める("/stats")).toBe("page");
  });
});

describe("殻の見出しを決める", () => {
  it("統計ではページ名を見出しにする", () => {
    expect(殻の見出しを決める("/stats")).toBe("統計");
  });

  it("ユーザーのページでは、ページ側がユーザー名を見出しにするので出さない", () => {
    expect(殻の見出しを決める("/user/taro")).toBeUndefined();
  });
});

describe("開いているPDのIDを求める", () => {
  it("PD を開いているときはその PD を指す", () => {
    expect(開いているPDのIDを求める("/pd/0190a1b2")).toBe("0190a1b2");
  });

  it("一覧だけを見ているときは開いている PD が無い", () => {
    expect(開いているPDのIDを求める("/notifications")).toBeNull();
  });
});

describe("一覧の持ち主を求める", () => {
  it("個人のタイムラインの一覧なら、その人の ID を返す", () => {
    expect(一覧の持ち主を求める("/user/taro")).toBe("taro");
  });

  it("ホームの一覧なら持ち主はいない", () => {
    expect(一覧の持ち主を求める("/")).toBeNull();
  });
});

describe("一覧に出すタブを決める", () => {
  it("タブの画面ではそのタブの一覧を出す", () => {
    expect(
      一覧に出すタブを決める({ pathname: "/bookmarks", lastTabHref: "/" }),
    ).toBe("/bookmarks");
  });

  it("PD を開いている間は直前に見ていたタブの一覧を残す", () => {
    expect(
      一覧に出すタブを決める({
        pathname: "/pd/abc",
        lastTabHref: "/notifications",
      }),
    ).toBe("/notifications");
  });

  it("個人のタイムラインでは、その人の一覧を出す", () => {
    expect(
      一覧に出すタブを決める({ pathname: "/user/taro", lastTabHref: "/" }),
    ).toBe("/user/taro");
  });

  it("個人のタイムラインから PD を開いても、その人の一覧を残す", () => {
    expect(
      一覧に出すタブを決める({
        pathname: "/pd/abc",
        lastTabHref: "/user/taro",
      }),
    ).toBe("/user/taro");
  });
});

import { describe, expect, it } from "vitest";
import {
  一覧と詳細の幅を保存する形にする,
  保存された一覧と詳細の幅を読む,
} from "./feed-layout-cookie";

describe("保存された一覧と詳細の幅を読む", () => {
  it("保存した幅をそのまま読み戻せる", () => {
    const saved = 一覧と詳細の幅を保存する形にする({
      layout: { list: 60, detail: 40 },
      now: 0,
    });

    const layout = 保存された一覧と詳細の幅を読む(saved.value);

    expect(layout).toEqual({ list: 60, detail: 40 });
  });

  it("まだ幅を保存していなければ、決まった初期の幅に任せる", () => {
    const layout = 保存された一覧と詳細の幅を読む(undefined);

    expect(layout).toBeUndefined();
  });

  it("壊れた値が残っていても、初期の幅で表示できる", () => {
    const layout = 保存された一覧と詳細の幅を読む("%7Bbroken");

    expect(layout).toBeUndefined();
  });

  it("一覧か詳細の幅が欠けていれば、初期の幅で表示する", () => {
    const layout = 保存された一覧と詳細の幅を読む(
      encodeURIComponent(JSON.stringify({ list: 60 })),
    );

    expect(layout).toBeUndefined();
  });

  it("幅に数でない値が入っていれば、初期の幅で表示する", () => {
    const layout = 保存された一覧と詳細の幅を読む(
      encodeURIComponent(JSON.stringify({ list: "60", detail: 40 })),
    );

    expect(layout).toBeUndefined();
  });
});

describe("一覧と詳細の幅を保存する形にする", () => {
  it("サイト全体で 1 年間覚えておく", () => {
    const cookie = 一覧と詳細の幅を保存する形にする({
      layout: { list: 50, detail: 50 },
      now: Date.parse("2026-01-01T00:00:00Z"),
    });

    expect(cookie).toMatchObject({
      path: "/",
      expires: Date.parse("2027-01-01T00:00:00Z"),
    });
  });
});

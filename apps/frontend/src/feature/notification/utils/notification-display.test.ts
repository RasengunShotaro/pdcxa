import { describe, expect, it } from "vitest";
import type { NotificationActor, NotificationItem } from "../types";
import {
  行為者の表示名,
  通知のリンク先,
  通知の行為文言,
} from "./notification-display";

const actor = (
  overrides: Partial<NotificationActor> = {},
): NotificationActor => ({
  id: "user_1",
  firstName: "太郎",
  lastName: "田中",
  imageUrl: "https://example.com/a.png",
  userName: "taro",
  ...overrides,
});

const notificationItem = (
  overrides: Partial<NotificationItem> = {},
): NotificationItem => ({
  kind: "pdLike",
  actor: actor(),
  pdId: "pd-1",
  rePdId: null,
  excerpt: "本文",
  createdAt: "2026-06-24T00:00:00.000Z",
  ...overrides,
});

describe("行為者の表示名", () => {
  it("姓名があればフルネームを返す", () => {
    expect(行為者の表示名(actor())).toBe("太郎 田中");
  });

  it("姓名が無ければ @userName を返す", () => {
    expect(行為者の表示名(actor({ firstName: null, lastName: null }))).toBe(
      "@taro",
    );
  });

  it("姓名も userName も無ければ退会したユーザーを返す", () => {
    expect(
      行為者の表示名(
        actor({ firstName: null, lastName: null, userName: null }),
      ),
    ).toBe("退会したユーザー");
  });
});

describe("通知の行為文言", () => {
  it("種別ごとの文言を返す", () => {
    expect(通知の行為文言("pdLike")).toBe("あなたの PD にいいねしました");
    expect(通知の行為文言("rePdLike")).toBe("あなたの RePd にいいねしました");
    expect(通知の行為文言("rePd")).toBe("あなたの PD に RePd しました");
  });
});

describe("通知のリンク先", () => {
  it("対象 PD の詳細へのリンクを返す", () => {
    expect(通知のリンク先(notificationItem({ pdId: "pd-1" }))).toBe("/pd/pd-1");
  });
});

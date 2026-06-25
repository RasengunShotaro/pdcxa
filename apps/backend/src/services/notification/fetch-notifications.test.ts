import { describe, expect, it } from "vitest";
import type { RawNotification } from "#/domain/notification/types";
import type { UserDetail } from "#/domain/user/service";
import { 通知に行為者を紐付ける } from "./fetch-notifications";

const 通知 = (actorUserId: string): RawNotification => ({
  kind: "pdLike",
  actorUserId,
  pdId: "pd-1",
  rePdId: null,
  excerpt: "本文",
  createdAt: new Date("2026-06-24T00:00:00.000Z"),
});

const ユーザー = (id: string): UserDetail => ({
  id,
  firstName: "太郎",
  lastName: "田中",
  imageUrl: "https://example.com/a.png",
  userName: "taro",
});

describe("通知に行為者を紐付ける", () => {
  it("行為者IDに一致するユーザー詳細を紐付ける", () => {
    const result = 通知に行為者を紐付ける(
      [通知("user-1")],
      [ユーザー("user-1")],
    );

    expect(result[0].actor.id).toBe("user-1");
    expect(result[0].actor.userName).toBe("taro");
  });

  it("行為者が見つからない場合は不明な行為者で埋める", () => {
    const result = 通知に行為者を紐付ける([通知("missing")], []);

    expect(result[0].actor).toEqual({
      id: "missing",
      firstName: null,
      lastName: null,
      imageUrl: "",
      userName: null,
    });
  });
});

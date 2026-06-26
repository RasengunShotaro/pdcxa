import { describe, expect, test } from "vitest";
import type { AuthUser } from "@/lib/auth/types";
import type { RawPd } from "../types/pd";
import { 作成したPDを詳細化する } from "./build-created-pd";

const aCreatedPd = (overrides: Partial<RawPd> = {}): RawPd => ({
  id: "pd-1",
  content: "作成したPD",
  createdAt: "2026-06-26T00:00:00.000Z",
  userId: "me",
  likeCount: 0,
  replyCount: 0,
  likes: [],
  isMyPd: true,
  imageFileName: null,
  ...overrides,
});

const aUser = (overrides: Partial<AuthUser> = {}): AuthUser => ({
  id: "me",
  firstName: "Dev",
  lastName: "User",
  fullName: "Dev User",
  imageUrl: "https://example.com/me.png",
  ...overrides,
});

describe("作成したPDを詳細化する", () => {
  test("投稿者を現在のユーザーの表示名と画像で埋める", () => {
    const result = 作成したPDを詳細化する({
      created: aCreatedPd(),
      user: aUser({
        fullName: "森 太郎",
        imageUrl: "https://example.com/a.png",
      }),
    });

    expect(result.userDetail).toMatchObject({
      id: "me",
      userFullName: "森 太郎",
      imageUrl: "https://example.com/a.png",
    });
  });

  test("フルネームが無いときは姓名を結合した表示名にする", () => {
    const result = 作成したPDを詳細化する({
      created: aCreatedPd(),
      user: aUser({ fullName: null, firstName: "Taro", lastName: "Mori" }),
    });

    expect(result.userDetail.userFullName).toBe("Taro Mori");
  });

  test("作成直後はいいねが付いていない状態で詳細化する", () => {
    const result = 作成したPDを詳細化する({
      created: aCreatedPd({ likeCount: 0, likes: [] }),
      user: aUser(),
    });

    expect(result.likeUsers).toEqual([]);
    expect(result.likeUserNames).toEqual([]);
  });
});

import { describe, expect, test } from "vitest";
import { buildLikeUser } from "./build-like-user";

describe("buildLikeUser", () => {
  test("フルネームがあればそのまま表示名にする", () => {
    const result = buildLikeUser({
      id: "me",
      firstName: "太郎",
      lastName: "山田",
      fullName: "山田 太郎",
      imageUrl: "https://example.com/me.jpg",
    });

    expect(result).toEqual({
      userId: "me",
      userFullName: "山田 太郎",
      imageUrl: "https://example.com/me.jpg",
      userName: "",
    });
  });

  test("フルネームが無ければ姓名を連結して表示名にする", () => {
    const result = buildLikeUser({
      id: "me",
      firstName: "太郎",
      lastName: "山田",
      fullName: null,
      imageUrl: "",
    });

    expect(result.userFullName).toBe("太郎 山田");
  });

  test("名前情報が全て無いときは表示名を空にする", () => {
    const result = buildLikeUser({
      id: "me",
      firstName: null,
      lastName: null,
      fullName: null,
      imageUrl: "",
    });

    expect(result.userFullName).toBe("");
  });

  test("ユーザーが居ないときは識別子を空にする", () => {
    const result = buildLikeUser(null);

    expect(result.userId).toBe("");
  });
});

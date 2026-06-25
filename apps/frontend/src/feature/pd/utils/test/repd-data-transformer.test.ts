import { describe, expect, test } from "vitest";
import type { RawRePd } from "../../types/pd";
import { RePdを詳細化する } from "../repd-data-transformer";
import { UserDetailMother } from "./utils";

const RawRePdMother = (override: Partial<RawRePd>): RawRePd => ({
  id: "repd-1",
  pdId: "pd-1",
  content: "とても参考になりました",
  createdAt: "2024-01-01T00:00:00.000Z",
  userId: "user-1",
  likeCount: 0,
  likes: [],
  isMyRePd: false,
  ...override,
});

describe("RePdを詳細化する", () => {
  test("投稿者の userDetail を紐付ける", () => {
    const rawRePds = [RawRePdMother({ userId: "user-1" })];
    const userDetails = [
      UserDetailMother({
        id: "user-1",
        firstName: "花子",
        lastName: "鈴木",
        userName: "hanako",
        imageUrl: "https://example.com/hanako.jpg",
      }),
    ];

    const [result] = RePdを詳細化する(rawRePds, userDetails);

    expect(result.userDetail).toEqual({
      id: "user-1",
      userFullName: "花子 鈴木",
      imageUrl: "https://example.com/hanako.jpg",
      userName: "hanako",
    });
  });

  test("いいねユーザーをアバター用 likeUsers と名前 likeUserNames の両方に詳細化する", () => {
    const rawRePds = [
      RawRePdMother({
        userId: "user-1",
        likeCount: 1,
        likes: [{ userId: "user-2" }],
      }),
    ];
    const userDetails = [
      UserDetailMother({ id: "user-1" }),
      UserDetailMother({
        id: "user-2",
        firstName: "次郎",
        lastName: "佐藤",
        userName: "jiro",
        imageUrl: "https://example.com/jiro.jpg",
      }),
    ];

    const [result] = RePdを詳細化する(rawRePds, userDetails);

    expect(result.likeUsers).toEqual([
      {
        userId: "user-2",
        userFullName: "次郎 佐藤",
        imageUrl: "https://example.com/jiro.jpg",
        userName: "jiro",
      },
    ]);
    expect(result.likeUserNames).toEqual(["次郎 佐藤"]);
  });

  test("ユーザー詳細が見つからないときは空文字でフォールバックする", () => {
    const rawRePds = [RawRePdMother({ userId: "missing" })];

    const [result] = RePdを詳細化する(rawRePds, []);

    expect(result.userDetail).toEqual({
      id: "",
      userFullName: "",
      imageUrl: "",
      userName: "",
    });
  });
});

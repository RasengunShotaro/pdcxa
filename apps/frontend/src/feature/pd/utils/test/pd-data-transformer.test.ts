import { describe, expect, test } from "vitest";
import type { RawPd, UserDetail } from "../../types/pd";
import {
  PDを詳細化する,
  ユーザーIDリストを抽出する,
} from "../pd-data-transformer";
import { RawPdMother, UserDetailMother } from "./utils";

describe("ユーザーIDリストを抽出する", () => {
  test("PDsからユーザーIDといいねユーザーIDを重複なしで抽出する", () => {
    const rawPds = [
      RawPdMother({
        id: "pd-1",
        userId: "user-1",
        likes: [{ userId: "user-2" }, { userId: "user-1" }],
      }),
      RawPdMother({
        id: "pd-2",
        userId: "user-2",
        likes: [{ userId: "user-3" }],
      }),
    ];

    const result = ユーザーIDリストを抽出する(rawPds);

    expect(result).toEqual(["user-1", "user-2", "user-3"]);
  });

  test("重複するユーザーIDは一意にする", () => {
    const rawPds = [
      RawPdMother({
        id: "pd-1",
        userId: "user-1",
        likes: [{ userId: "user-2" }, { userId: "user-1" }],
      }),
      RawPdMother({
        id: "pd-2",
        userId: "user-2",
        likes: [{ userId: "user-3" }],
      }),
    ];

    const result = ユーザーIDリストを抽出する(rawPds);

    expect(result).toEqual(["user-1", "user-2", "user-3"]);
  });

  test("いいねが空の場合はPD作成者のIDのみを抽出する", () => {
    const rawPds = [
      RawPdMother({ userId: "user-1", likes: [] }),
      RawPdMother({ userId: "user-2", likes: [] }),
    ];

    const result = ユーザーIDリストを抽出する(rawPds);

    expect(result).toEqual(["user-1", "user-2"]);
  });

  test("同一PDで複数のいいねがある場合は全てのユーザーIDを抽出する", () => {
    const rawPds = [
      RawPdMother({
        userId: "user-1",
        likes: [
          { userId: "user-2" },
          { userId: "user-3" },
          { userId: "user-4" },
        ],
      }),
    ];

    const result = ユーザーIDリストを抽出する(rawPds);

    expect(result).toEqual(["user-1", "user-2", "user-3", "user-4"]);
  });
});

describe("PDを詳細化する", () => {
  test("正しく詳細化される", () => {
    const rawPds = [
      RawPdMother({
        id: "pd-1",
        userId: "user-1",
        likes: [{ userId: "user-2" }, { userId: "user-3" }],
      }),
    ];
    const userDetails = [
      UserDetailMother({
        id: "user-1",
        firstName: "田中1",
        lastName: "太郎1",
        imageUrl: "https://example.com/avatar1.jpg",
        userName: "user1",
      }),
      UserDetailMother({
        id: "user-2",
        firstName: "田中2",
        lastName: "太郎2",
        imageUrl: "https://example.com/avatar2.jpg",
        userName: "user2",
      }),
      UserDetailMother({
        id: "user-3",
        firstName: "田中3",
        lastName: "太郎3",
        imageUrl: "https://example.com/avatar3.jpg",
        userName: "user3",
      }),
    ];

    const result = PDを詳細化する(rawPds, userDetails);

    expect(result).toEqual([
      {
        ...rawPds[0],
        userDetail: {
          id: "user-1",
          userFullName: "田中1 太郎1",
          imageUrl: "https://example.com/avatar1.jpg",
          userName: "user1",
        },
        likeUserNames: ["田中2 太郎2", "田中3 太郎3"],
      },
    ]);
  });

  test("空配列を渡した場合は空配列を返す", () => {
    const rawPds: RawPd[] = [];
    const userDetails = [
      UserDetailMother({ id: "user-1" }),
      UserDetailMother({ id: "user-2" }),
      UserDetailMother({ id: "user-3" }),
    ];

    const result = PDを詳細化する(rawPds, userDetails);

    expect(result).toEqual([]);
  });

  test("ユーザー詳細情報が見つからない場合、空文字として扱われる", () => {
    const rawPds = [
      RawPdMother({
        userId: "unknown-user",
        likes: [{ userId: "unknown-user-2" }],
      }),
    ];
    const userDetails: UserDetail[] = [];

    const result = PDを詳細化する(rawPds, userDetails);

    expect(result).toEqual([
      {
        ...rawPds[0],
        userDetail: {
          id: "",
          userFullName: "",
          imageUrl: "",
          userName: "",
        },
        likeUserNames: [""],
      },
    ]);
  });

  test("firstNameまたはlastNameがない場合、空文字として扱われる", () => {
    const rawPds = [
      RawPdMother({
        userId: "user-2",
        likes: [{ userId: "user-3" }, { userId: "user-4" }],
      }),
    ];
    const userDetails = [
      UserDetailMother({
        id: "user-1",
        firstName: "田中",
        lastName: "太郎",
        userName: "user1",
      }),
      UserDetailMother({
        id: "user-2",
        firstName: null,
        lastName: "次郎",
        userName: "user2",
      }),
      UserDetailMother({
        id: "user-3",
        firstName: "三郎",
        lastName: null,
        userName: "user3",
      }),
      UserDetailMother({
        id: "user-4",
        firstName: null,
        lastName: null,
        userName: null,
      }),
    ];

    const result = PDを詳細化する(rawPds, userDetails);

    expect(result).toEqual([
      {
        ...rawPds[0],
        userDetail: {
          id: "user-2",
          userFullName: "次郎",
          imageUrl: userDetails[1].imageUrl || "",
          userName: "user2",
        },
        likeUserNames: ["三郎", ""],
      },
    ]);
  });

  test("複数のPDが存在する場合", () => {
    const rawPds = [
      RawPdMother({
        id: "pd-1",
        userId: "user-1",
        likes: [],
      }),
      RawPdMother({
        id: "pd-2",
        userId: "user-2",
        likes: [{ userId: "user-3" }],
      }),
    ];
    const userDetails = [
      UserDetailMother({
        id: "user-1",
        firstName: "田中1",
        lastName: "太郎1",
        userName: "user1",
      }),
      UserDetailMother({
        id: "user-2",
        firstName: "田中2",
        lastName: "太郎2",
        userName: "user2",
      }),
      UserDetailMother({
        id: "user-3",
        firstName: "田中3",
        lastName: "太郎3",
        userName: "user3",
      }),
    ];

    const result = PDを詳細化する(rawPds, userDetails);

    expect(result).toEqual([
      {
        ...rawPds[0],
        userDetail: {
          id: "user-1",
          userFullName: "田中1 太郎1",
          imageUrl: userDetails[0].imageUrl || "",
          userName: "user1",
        },
        likeUserNames: [],
      },
      {
        ...rawPds[1],
        userDetail: {
          id: "user-2",
          userFullName: "田中2 太郎2",
          imageUrl: userDetails[1].imageUrl || "",
          userName: "user2",
        },
        likeUserNames: ["田中3 太郎3"],
      },
    ]);
  });

  test("同一ユーザーが複数のPDを投稿している場合", () => {
    const rawPds = [
      RawPdMother({ id: "pd-1", userId: "user-1", likes: [] }),
      RawPdMother({
        id: "pd-2",
        userId: "user-1",
        likes: [{ userId: "user-2" }],
      }),
    ];
    const userDetails = [
      UserDetailMother({
        id: "user-1",
        firstName: "田中1",
        lastName: "太郎1",
        userName: "user1",
      }),
      UserDetailMother({
        id: "user-2",
        firstName: "田中2",
        lastName: "太郎2",
        userName: "user2",
      }),
    ];

    const result = PDを詳細化する(rawPds, userDetails);

    expect(result).toEqual([
      {
        ...rawPds[0],
        userDetail: {
          id: "user-1",
          userFullName: "田中1 太郎1",
          imageUrl: userDetails[0].imageUrl || "",
          userName: "user1",
        },
        likeUserNames: [],
      },
      {
        ...rawPds[1],
        userDetail: {
          id: "user-1",
          userFullName: "田中1 太郎1",
          imageUrl: userDetails[0].imageUrl || "",
          userName: "user1",
        },
        likeUserNames: ["田中2 太郎2"],
      },
    ]);
  });
});

describe("内部関数の振る舞い", () => {
  test("いいねしたユーザーのフルネーム一覧が取得できる", () => {
    const rawPds = [
      RawPdMother({
        userId: "user-1",
        likes: [
          { userId: "user-2" },
          { userId: "user-3" },
          { userId: "user-4" },
        ],
      }),
    ];
    const userDetails = [
      UserDetailMother({
        id: "user-2",
        firstName: null,
        lastName: "次郎",
        userName: "user2",
      }),
      UserDetailMother({
        id: "user-3",
        firstName: "三郎",
        lastName: null,
        userName: "user3",
      }),
      UserDetailMother({
        id: "user-4",
        firstName: null,
        lastName: null,
        userName: null,
      }),
    ];

    const result = PDを詳細化する(rawPds, userDetails);

    expect(result[0].likeUserNames).toEqual(["次郎", "三郎", ""]);
  });
});

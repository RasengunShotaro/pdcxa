import { describe, expect, test } from "vitest";
import { ApiError } from "@/lib/api-error";
import type { Pd } from "../types";
import { PDを引用元にする, 投稿失敗の表示を決める } from "./quote";

const aPd = (overrides: Partial<Pd> = {}): Pd => ({
  id: "pd-1",
  content: "テストは後から書けば十分だと思う",
  createdAt: "2026-03-12T00:00:00.000Z",
  userId: "hinata",
  likeCount: 3,
  replyCount: 1,
  likes: [],
  isMyPd: false,
  isBookmarked: false,
  imageFileName: null,
  quotedPd: null,
  quoteCount: 0,
  userDetail: {
    id: "hinata",
    userFullName: "佐藤 陽",
    imageUrl: "https://example.com/hinata.png",
    userName: "hinata",
  },
  likeUserNames: [],
  likeUsers: [],
  ...overrides,
});

describe("PDを引用元にする", () => {
  test("引用元として本文・投稿日時・投稿者の表示を持つ", () => {
    const result = PDを引用元にする(aPd());

    expect(result).toEqual({
      id: "pd-1",
      content: "テストは後から書けば十分だと思う",
      createdAt: "2026-03-12T00:00:00.000Z",
      userId: "hinata",
      userDetail: {
        userFullName: "佐藤 陽",
        imageUrl: "https://example.com/hinata.png",
        userName: "hinata",
      },
    });
  });
});

describe("投稿失敗の表示を決める", () => {
  test("引用して投稿し引用元が見つからないときは、その旨を伝える", () => {
    const result = 投稿失敗の表示を決める({
      error: new ApiError(404),
      isQuoting: true,
    });

    expect(result.message).toBe("引用元の PD が見つかりませんでした");
  });

  test("引用せずに投稿して失敗したときは通常の失敗表示にする", () => {
    const result = 投稿失敗の表示を決める({
      error: new ApiError(404),
      isQuoting: false,
    });

    expect(result.message).toBe("予期しないエラーが発生しました");
  });

  test("引用していても通信の失敗は再試行を促す", () => {
    const result = 投稿失敗の表示を決める({
      error: new ApiError(503),
      isQuoting: true,
    });

    expect(result.kind).toBe("retryable");
  });
});

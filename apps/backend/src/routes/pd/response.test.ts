import { describe, expect, it } from "vitest";
import type { PdDetail } from "#/domain/pd/types";
import { PDをレスポンス形式にする } from "./response";

const aPdDetail = (overrides: Partial<PdDetail> = {}): PdDetail => ({
  id: "pd-1",
  content: "本文",
  createdAt: new Date("2026-06-26T00:00:00.000Z"),
  userId: "author",
  imageFileName: null,
  likeCount: 0,
  replyCount: 0,
  likes: [],
  quotedPd: null,
  quoteCount: 0,
  isMyPd: false,
  isBookmarked: false,
  ...overrides,
});

describe("PDをレスポンス形式にする", () => {
  it("投稿日時を ISO 形式の文字列で返す", () => {
    const pd = aPdDetail({ createdAt: new Date("2026-06-26T00:00:00.000Z") });

    expect(PDをレスポンス形式にする(pd).createdAt).toBe(
      "2026-06-26T00:00:00.000Z",
    );
  });

  it("引用元の投稿日時も ISO 形式の文字列で返す", () => {
    const pd = aPdDetail({
      quotedPd: {
        id: "pd-0",
        content: "引用元",
        createdAt: new Date("2026-03-12T00:00:00.000Z"),
        userId: "original",
      },
    });

    expect(PDをレスポンス形式にする(pd).quotedPd?.createdAt).toBe(
      "2026-03-12T00:00:00.000Z",
    );
  });

  it("引用していない PD は引用元なしで返す", () => {
    const pd = aPdDetail({ quotedPd: null });

    expect(PDをレスポンス形式にする(pd).quotedPd).toBeNull();
  });
});

import { type InfiniteData, QueryClient } from "@tanstack/react-query";
import { describe, expect, test } from "vitest";
import { bookmarkedPdsQueryKey, pdDetailQueryKey } from "../api/query-keys";
import type { Pd } from "../types";
import {
  optimisticUpdateBookmark,
  PDの保存状態を差し替える,
} from "./optimistic-update-bookmark";

type InfinitePds = {
  items: Pd[];
  nextCursor?: string;
};

const aPd = (overrides: Partial<Pd> = {}): Pd => ({
  id: "pd-1",
  content: "本文",
  createdAt: "2026-06-24T00:00:00.000Z",
  userId: "author",
  likeCount: 0,
  replyCount: 0,
  likes: [],
  isMyPd: false,
  isBookmarked: false,
  imageFileName: null,
  userDetail: {
    id: "author",
    userFullName: "投稿者",
    imageUrl: "",
    userName: "author",
  },
  likeUserNames: [],
  likeUsers: [],
  ...overrides,
});

const pagesOf = (...pds: Pd[]): InfiniteData<InfinitePds> => ({
  pages: [{ items: pds, nextCursor: undefined }],
  pageParams: [undefined],
});

describe("PDの保存状態を差し替える", () => {
  test("対象の PD だけを保存済みにする", () => {
    const pages = pagesOf(aPd({ id: "pd-1" }), aPd({ id: "pd-2" }));

    const result = PDの保存状態を差し替える({
      pages,
      pdId: "pd-2",
      bookmarked: true,
    });

    expect(result.pages[0].items.map((pd) => [pd.id, pd.isBookmarked])).toEqual(
      [
        ["pd-1", false],
        ["pd-2", true],
      ],
    );
  });

  test("保存を外すと保存済みでなくなる", () => {
    const pages = pagesOf(aPd({ id: "pd-1", isBookmarked: true }));

    const result = PDの保存状態を差し替える({
      pages,
      pdId: "pd-1",
      bookmarked: false,
    });

    expect(result.pages[0].items[0].isBookmarked).toBe(false);
  });
});

describe("optimisticUpdateBookmark", () => {
  test("ホームと保存一覧の両方に同じ PD の保存状態を反映する", async () => {
    const queryClient = new QueryClient();
    queryClient.setQueryData(pdDetailQueryKey(), pagesOf(aPd()));
    queryClient.setQueryData(bookmarkedPdsQueryKey(), pagesOf(aPd()));

    await optimisticUpdateBookmark({
      queryClient,
      pdId: "pd-1",
      bookmarked: true,
    });

    const 保存状態 = [pdDetailQueryKey(), bookmarkedPdsQueryKey()].map(
      (key) =>
        queryClient.getQueryData<InfiniteData<InfinitePds>>(key)?.pages[0]
          .items[0].isBookmarked,
    );
    expect(保存状態).toEqual([true, true]);
  });

  test("失敗時に戻せるよう更新前の一覧を返す", async () => {
    const queryClient = new QueryClient();
    queryClient.setQueryData(pdDetailQueryKey(), pagesOf(aPd()));

    const { previousQueries } = await optimisticUpdateBookmark({
      queryClient,
      pdId: "pd-1",
      bookmarked: true,
    });

    expect(previousQueries[0][1]?.pages[0].items[0].isBookmarked).toBe(false);
  });
});

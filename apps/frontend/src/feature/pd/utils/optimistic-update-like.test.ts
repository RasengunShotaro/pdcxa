import { type InfiniteData, QueryClient } from "@tanstack/react-query";
import { describe, expect, test } from "vitest";
import { pdDetailQueryKey } from "../api/query-keys";
import type { LikeUser, Pd } from "../types";
import { optimisticUpdateLike } from "./optimistic-update-like";

type InfinitePds = {
  items: Pd[];
  nextCursor?: string;
};

const aPd = (overrides: Partial<Pd> = {}): Pd => ({
  id: "pd-1",
  content: "本文",
  createdAt: "2026-06-24T00:00:00.000Z",
  userId: "author",
  likeCount: 1,
  replyCount: 0,
  likes: [{ userId: "other" }],
  isMyPd: false,
  imageFileName: null,
  userDetail: {
    id: "author",
    userFullName: "投稿者",
    imageUrl: "",
    userName: "author",
  },
  likeUserNames: ["他の人"],
  likeUsers: [
    {
      userId: "other",
      userFullName: "他の人",
      imageUrl: "",
      userName: "other",
    },
  ],
  ...overrides,
});

const me: LikeUser = {
  userId: "me",
  userFullName: "自分",
  imageUrl: "",
  userName: "",
};

const queryKey = pdDetailQueryKey();

const seed = (pd: Pd) => {
  const queryClient = new QueryClient();
  const data: InfiniteData<InfinitePds> = {
    pages: [{ items: [pd], nextCursor: undefined }],
    pageParams: [undefined],
  };
  queryClient.setQueryData(queryKey, data);
  return queryClient;
};

const firstPd = (queryClient: QueryClient): Pd => {
  const data = queryClient.getQueryData<InfiniteData<InfinitePds>>(queryKey);
  return data?.pages[0].items[0] as Pd;
};

describe("optimisticUpdateLike", () => {
  test("未いいねから押すと自分を likes・likeUsers の両方に加え件数を増やす", async () => {
    const pd = aPd();
    const queryClient = seed(pd);

    await optimisticUpdateLike({
      pd,
      queryKey,
      queryClient,
      myUserId: "me",
      myLikeUser: me,
    });

    const updated = firstPd(queryClient);
    expect(updated.likeCount).toBe(2);
    expect(updated.likes).toContainEqual({ userId: "me" });
    expect(updated.likeUsers).toContainEqual(me);
  });

  test("いいね済みから押すと自分を likes・likeUsers の両方から外し件数を減らす", async () => {
    const pd = aPd({
      likeCount: 2,
      likes: [{ userId: "other" }, { userId: "me" }],
      likeUsers: [
        {
          userId: "other",
          userFullName: "他の人",
          imageUrl: "",
          userName: "other",
        },
        me,
      ],
    });
    const queryClient = seed(pd);

    await optimisticUpdateLike({
      pd,
      queryKey,
      queryClient,
      myUserId: "me",
      myLikeUser: me,
    });

    const updated = firstPd(queryClient);
    expect(updated.likeCount).toBe(1);
    expect(updated.likes).not.toContainEqual({ userId: "me" });
    expect(updated.likeUsers).not.toContainEqual(me);
  });
});

import { describe, expect, test } from "vitest";
import type { LikeUser, RePd } from "../types";
import { optimisticToggleRePdLike } from "./optimistic-repd-like";

const RePdMother = (override: Partial<RePd>): RePd => ({
  id: "repd-1",
  pdId: "pd-1",
  content: "とても参考になりました",
  createdAt: "2024-01-01T00:00:00.000Z",
  userId: "author",
  likeCount: 0,
  likes: [],
  isMyRePd: false,
  userDetail: {
    id: "author",
    userFullName: "投稿 者",
    imageUrl: "",
    userName: "author",
  },
  likeUserNames: [],
  likeUsers: [],
  ...override,
});

const me: LikeUser = {
  userId: "me",
  userFullName: "自分 太郎",
  imageUrl: "https://example.com/me.jpg",
  userName: "",
};

describe("optimisticToggleRePdLike", () => {
  test("未いいねならいいねを追加し likeCount と likeUsers を増やす", () => {
    const rePds = [RePdMother({ id: "repd-1" })];

    const [result] = optimisticToggleRePdLike({
      rePds,
      rePdId: "repd-1",
      myUserId: "me",
      myLikeUser: me,
    });

    expect(result.likes).toEqual([{ userId: "me" }]);
    expect(result.likeUsers).toEqual([me]);
    expect(result.likeCount).toBe(1);
  });

  test("いいね済みならいいねを外し likeCount と likeUsers を減らす", () => {
    const rePds = [
      RePdMother({
        id: "repd-1",
        likeCount: 1,
        likes: [{ userId: "me" }],
        likeUsers: [me],
      }),
    ];

    const [result] = optimisticToggleRePdLike({
      rePds,
      rePdId: "repd-1",
      myUserId: "me",
      myLikeUser: me,
    });

    expect(result.likes).toEqual([]);
    expect(result.likeUsers).toEqual([]);
    expect(result.likeCount).toBe(0);
  });

  test("対象外の RePd は変更しない", () => {
    const other = RePdMother({ id: "repd-2" });
    const rePds = [RePdMother({ id: "repd-1" }), other];

    const result = optimisticToggleRePdLike({
      rePds,
      rePdId: "repd-1",
      myUserId: "me",
      myLikeUser: me,
    });

    expect(result[1]).toBe(other);
  });
});

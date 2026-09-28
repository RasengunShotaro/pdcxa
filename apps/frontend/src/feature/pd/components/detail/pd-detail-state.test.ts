import { describe, expect, it } from "vitest";
import type { Pd } from "@/feature/pd/types";
import type { PdDetailSnapshot } from "@/feature/pd/utils/optimistic-update-like";
import {
  PD詳細の表示状態を決める,
  一覧に読み込み済みのPDを探す,
} from "./pd-detail-state";

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
  quotedPd: null,
  quoteCount: 0,
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

const aList = (pages: Pd[][]): PdDetailSnapshot[number] => [
  ["pd", "詳細"],
  {
    pages: pages.map((items) => ({ items })),
    pageParams: pages.map(() => undefined),
  },
];

describe("一覧に読み込み済みのPDを探す", () => {
  it("2 ページ目以降に読み込んだ PD も見つける", () => {
    const cachedLists = [
      aList([[aPd({ id: "pd-1" })], [aPd({ id: "pd-2", content: "二枚目" })]]),
    ];

    const found = 一覧に読み込み済みのPDを探す({ cachedLists, pdId: "pd-2" });

    expect(found?.content).toBe("二枚目");
  });

  it("別の一覧に読み込まれた PD も見つける", () => {
    const cachedLists = [
      aList([[aPd({ id: "pd-1" })]]),
      aList([[aPd({ id: "pd-9", content: "保存した投稿" })]]),
    ];

    const found = 一覧に読み込み済みのPDを探す({ cachedLists, pdId: "pd-9" });

    expect(found?.content).toBe("保存した投稿");
  });

  it("まだ読み込まれていない一覧は無視して探す", () => {
    const cachedLists: PdDetailSnapshot = [
      [["pd", "詳細"], undefined],
      aList([[aPd({ id: "pd-3" })]]),
    ];

    const found = 一覧に読み込み済みのPDを探す({ cachedLists, pdId: "pd-3" });

    expect(found?.id).toBe("pd-3");
  });

  it("どの一覧にも無い PD は見つからない", () => {
    const cachedLists = [aList([[aPd({ id: "pd-1" })]])];

    const found = 一覧に読み込み済みのPDを探す({ cachedLists, pdId: "pd-404" });

    expect(found).toBeUndefined();
  });
});

describe("PD詳細の表示状態を決める", () => {
  it("取得中でも一覧で読み込み済みの PD があればすぐに表示する", () => {
    const cachedPd = aPd({ content: "一覧で見た投稿" });

    const state = PD詳細の表示状態を決める({
      fetchedPd: undefined,
      cachedPd,
      isPending: true,
      isError: false,
    });

    expect(state).toEqual({ kind: "ready", pd: cachedPd });
  });

  it("取得中で一覧にも無ければ読み込み中にする", () => {
    const state = PD詳細の表示状態を決める({
      fetchedPd: undefined,
      cachedPd: undefined,
      isPending: true,
      isError: false,
    });

    expect(state).toEqual({ kind: "loading" });
  });

  it("取得し終えたら一覧の PD より取得した PD を表示する", () => {
    const fetchedPd = aPd({ content: "最新の投稿" });

    const state = PD詳細の表示状態を決める({
      fetchedPd,
      cachedPd: aPd({ content: "古い投稿" }),
      isPending: false,
      isError: false,
    });

    expect(state).toEqual({ kind: "ready", pd: fetchedPd });
  });

  it("取得に失敗したら一覧に PD があっても失敗として扱う", () => {
    const state = PD詳細の表示状態を決める({
      fetchedPd: undefined,
      cachedPd: aPd(),
      isPending: false,
      isError: true,
    });

    expect(state).toEqual({ kind: "error" });
  });

  it("取得し終えて PD が無ければ見つからないとする", () => {
    const state = PD詳細の表示状態を決める({
      fetchedPd: undefined,
      cachedPd: undefined,
      isPending: false,
      isError: false,
    });

    expect(state).toEqual({ kind: "notFound" });
  });
});

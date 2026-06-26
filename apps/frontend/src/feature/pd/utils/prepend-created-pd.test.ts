import {
  type InfiniteData,
  InfiniteQueryObserver,
  QueryClient,
} from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { pdDetailQueryKey } from "../api/query-keys";
import type { Pd } from "../types";
import { PDをタイムラインに楽観追加する } from "./prepend-created-pd";

type InfinitePds = { items: Pd[]; nextCursor?: string };

const PAGE_SIZE = 3;
const queryKey = pdDetailQueryKey();

const aPd = (id: string): Pd => ({
  id,
  content: `本文 ${id}`,
  createdAt: "2026-06-24T00:00:00.000Z",
  userId: "author",
  likeCount: 0,
  replyCount: 0,
  likes: [],
  isMyPd: false,
  imageFileName: null,
  userDetail: {
    id: "author",
    userFullName: "投稿者",
    imageUrl: "",
    userName: "author",
  },
  likeUserNames: [],
  likeUsers: [],
});

const ALL_PDS = Array.from({ length: 9 }, (_, i) => aPd(`pd-${i}`));

const makeBackend = () => {
  const fetchCalls: Array<string | undefined> = [];
  const fetchPage = async (cursor?: string): Promise<InfinitePds> => {
    fetchCalls.push(cursor);
    const start = cursor === undefined ? 0 : Number(cursor);
    const items = ALL_PDS.slice(start, start + PAGE_SIZE);
    const nextStart = start + PAGE_SIZE;
    return {
      items,
      nextCursor: nextStart < ALL_PDS.length ? String(nextStart) : undefined,
    };
  };
  return { fetchPage, fetchCalls };
};

let queryClient: QueryClient;

beforeEach(() => {
  queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
});

afterEach(() => queryClient.clear());

const data = () =>
  queryClient.getQueryData<InfiniteData<InfinitePds>>(queryKey);
const flatIds = () =>
  data()?.pages.flatMap((page) => page.items.map((item) => item.id)) ?? [];

const 二ページ読み込む = async (
  fetchPage: (cursor?: string) => Promise<InfinitePds>,
) => {
  const observer = new InfiniteQueryObserver<InfinitePds>(queryClient, {
    queryKey,
    queryFn: ({ pageParam }) => fetchPage(pageParam as string | undefined),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
  const unsubscribe = observer.subscribe(() => {});
  await observer.refetch();
  await observer.fetchNextPage();
  return { observer, unsubscribe };
};

describe("PDをタイムラインに楽観追加する", () => {
  test("無限スクロールで蓄積したページを崩さずに保持する", async () => {
    const backend = makeBackend();
    const { observer, unsubscribe } = await 二ページ読み込む(backend.fetchPage);
    expect(data()?.pages).toHaveLength(2);

    PDをタイムラインに楽観追加する({ queryClient, pd: aPd("pd-new") });

    expect(data()?.pages).toHaveLength(2);
    expect(observer.getCurrentResult().hasNextPage).toBe(true);

    unsubscribe();
  });

  test("新規投稿をタイムラインの先頭に表示する", async () => {
    const backend = makeBackend();
    const { unsubscribe } = await 二ページ読み込む(backend.fetchPage);

    PDをタイムラインに楽観追加する({ queryClient, pd: aPd("pd-new") });

    expect(flatIds()[0]).toBe("pd-new");

    unsubscribe();
  });

  test("タイムラインの再取得を起こさない", async () => {
    const backend = makeBackend();
    const { unsubscribe } = await 二ページ読み込む(backend.fetchPage);
    const callsBefore = backend.fetchCalls.length;

    PDをタイムラインに楽観追加する({ queryClient, pd: aPd("pd-new") });

    expect(backend.fetchCalls.length).toBe(callsBefore);

    unsubscribe();
  });

  test("タイムライン未読み込みのときは何も追加しない", () => {
    PDをタイムラインに楽観追加する({ queryClient, pd: aPd("pd-new") });

    expect(queryClient.getQueryData(queryKey)).toBeUndefined();
  });

  test("空ページのときは投稿を追加しない", () => {
    queryClient.setQueryData<InfiniteData<InfinitePds>>(queryKey, {
      pages: [],
      pageParams: [],
    });

    PDをタイムラインに楽観追加する({ queryClient, pd: aPd("pd-new") });

    expect(flatIds()).toEqual([]);
    expect(data()?.pages).toHaveLength(0);
  });
});

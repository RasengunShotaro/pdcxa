import {
  type InfiniteData,
  InfiniteQueryObserver,
  MutationObserver,
  QueryClient,
} from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { pdDetailQueryKey } from "../api/query-keys";
import type { LikeUser, Pd } from "../types";
import { createPdLikeMutationOptions } from "./pd-like-mutation-options";

vi.mock("@/feature/pd/api/pd/mutate-pd-like", () => ({
  mutatePdLike: async () => undefined,
}));
vi.mock("@/utils/legacy-delay", () => ({ legacyDelay: async () => undefined }));
vi.mock("sonner", () => ({ toast: { warning: () => undefined } }));

type InfinitePds = { items: Pd[]; nextCursor?: string };

const aPd = (id: string, overrides: Partial<Pd> = {}): Pd => ({
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
  ...overrides,
});

const me: LikeUser = {
  userId: "me",
  userFullName: "自分",
  imageUrl: "",
  userName: "",
};

const PAGE_SIZE = 3;
const ALL_PDS: Pd[] = Array.from({ length: 9 }, (_, i) => aPd(`pd-${i}`));
const queryKey = pdDetailQueryKey();

// 「いいね後に過去ページが取りこぼされる」不安定なバックエンドを再現する。
// 2 回目以降の 1 ページ目取得は nextCursor を返さず、全ページ再取得が
// 1 ページに崩れるようにする。
const makeUnstableFetch = () => {
  let pageOneFetches = 0;
  const fetchCalls: Array<string | undefined> = [];

  const fetchPage = async (cursor?: string): Promise<InfinitePds> => {
    fetchCalls.push(cursor);
    if (cursor === undefined) {
      pageOneFetches += 1;
      const items = ALL_PDS.slice(0, PAGE_SIZE);
      return {
        items,
        nextCursor: pageOneFetches >= 2 ? undefined : String(PAGE_SIZE),
      };
    }
    const start = Number(cursor);
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

afterEach(() => {
  queryClient.clear();
});

const currentData = () =>
  queryClient.getQueryData<InfiniteData<InfinitePds>>(queryKey);

const seedTwoLoadedPages = async (
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

const likePd = async (pd: Pd) => {
  const mutation = new MutationObserver(
    queryClient,
    createPdLikeMutationOptions({
      pd,
      queryKey,
      queryClient,
      myUserId: "me",
      myLikeUser: me,
    }),
  );
  await mutation.mutate();
};

const waitForQueriesIdle = async () => {
  while (queryClient.isFetching() > 0) {
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
};

describe("いいねと無限スクロールで蓄積したページ", () => {
  test("過去ページにいいねしても蓄積済みのページが維持される", async () => {
    const { fetchPage } = makeUnstableFetch();
    const { observer, unsubscribe } = await seedTwoLoadedPages(fetchPage);
    expect(currentData()?.pages).toHaveLength(2);

    const targetPd = currentData()?.pages[1].items[0] as Pd;
    await likePd(targetPd);
    await waitForQueriesIdle();

    expect(currentData()?.pages).toHaveLength(2);
    expect(observer.getCurrentResult().hasNextPage).toBe(true);

    unsubscribe();
  });

  test("いいねはタイムラインの再取得を起こさない", async () => {
    const { fetchPage, fetchCalls } = makeUnstableFetch();
    const { unsubscribe } = await seedTwoLoadedPages(fetchPage);
    const callsBeforeLike = fetchCalls.length;

    const targetPd = currentData()?.pages[0].items[0] as Pd;
    await likePd(targetPd);

    expect(fetchCalls.length).toBe(callsBeforeLike);

    unsubscribe();
  });

  test("いいねした投稿には自分のいいねが楽観的に反映される", async () => {
    const { fetchPage } = makeUnstableFetch();
    const { unsubscribe } = await seedTwoLoadedPages(fetchPage);

    const targetPd = currentData()?.pages[0].items[0] as Pd;
    await likePd(targetPd);

    const updated = currentData()?.pages[0].items[0] as Pd;
    expect(updated.likes).toContainEqual({ userId: "me" });
    expect(updated.likeCount).toBe(1);

    unsubscribe();
  });
});

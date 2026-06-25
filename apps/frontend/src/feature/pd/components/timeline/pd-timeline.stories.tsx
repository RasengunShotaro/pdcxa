import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HttpResponse, http } from "msw";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { PdTimeline } from "./pd-timeline";

interface RawLike {
  userId: string;
}

const rawPd = (overrides: {
  id: string;
  content: string;
  userId: string;
  likes?: RawLike[];
  replyCount?: number;
  isMyPd?: boolean;
}) => ({
  id: overrides.id,
  content: overrides.content,
  userId: overrides.userId,
  createdAt: "2026-06-24T00:00:00.000Z",
  imageFileName: null,
  likeCount: overrides.likes?.length ?? 0,
  replyCount: overrides.replyCount ?? 0,
  likes: overrides.likes ?? [],
  isMyPd: overrides.isMyPd ?? false,
});

const userDetail = (
  id: string,
  firstName: string,
  lastName: string,
  userName: string,
) => ({
  id,
  firstName,
  lastName,
  imageUrl: "",
  userName,
});

const USERS = [
  userDetail("u-taro", "太郎", "山田", "taro"),
  userDetail("u-hanako", "花子", "鈴木", "hanako"),
];

const userDetailsHandler = () =>
  http.get("*/user/details", () => HttpResponse.json(USERS));

const meta: Meta<typeof PdTimeline> = {
  title: "ホーム/PdTimeline",
  component: PdTimeline,
  parameters: { layout: "padded" },
};

export default meta;

type Story = StoryObj<typeof PdTimeline>;

export const Populated: Story = {
  name: "PD が並ぶ",
  parameters: {
    msw: {
      handlers: [
        http.get("*/pd", () =>
          HttpResponse.json({
            items: [
              rawPd({
                id: "pd-1",
                content: "今日の現場メモを共有します",
                userId: "u-taro",
                likes: [{ userId: "u-hanako" }],
                replyCount: 2,
              }),
              rawPd({
                id: "pd-2",
                content: "RePd お待ちしています",
                userId: "u-hanako",
              }),
            ],
          }),
        ),
        userDetailsHandler(),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() =>
      expect(
        canvas.getByText("今日の現場メモを共有します"),
      ).toBeInTheDocument(),
    );
    expect(canvas.getByText("RePd お待ちしています")).toBeInTheDocument();
    expect(canvas.getByText("@taro")).toBeInTheDocument();
    expect(
      canvas.getByRole("link", { name: "2件の返信を見る" }),
    ).toHaveAttribute("href", "/pd/pd-1");
  },
};

export const Empty: Story = {
  name: "1件も無いとき空状態を出す",
  parameters: {
    msw: {
      handlers: [
        http.get("*/pd", () => HttpResponse.json({ items: [] })),
        userDetailsHandler(),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() =>
      expect(canvas.getByText("まだ PD がありません")).toBeInTheDocument(),
    );
  },
};

export const FetchFailed: Story = {
  name: "取得に失敗したら再試行を出す",
  parameters: {
    msw: {
      handlers: [
        http.get("*/pd", () => new HttpResponse(null, { status: 500 })),
        userDetailsHandler(),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() =>
      expect(
        canvas.getByText("通信に失敗しました。再試行してください"),
      ).toBeInTheDocument(),
    );
    expect(canvas.getByRole("button", { name: "再試行" })).toBeInTheDocument();
  },
};

export const LoadMore: Story = {
  name: "さらに読むで続きを読み込む",
  parameters: {
    msw: {
      handlers: [
        http.get("*/pd", ({ request }) => {
          const cursor = new URL(request.url).searchParams.get("cursor");
          if (cursor === "page-2") {
            return HttpResponse.json({
              items: [
                rawPd({
                  id: "pd-2",
                  content: "2ページ目の投稿",
                  userId: "u-hanako",
                }),
              ],
            });
          }
          return HttpResponse.json({
            items: [
              rawPd({
                id: "pd-1",
                content: "1ページ目の投稿",
                userId: "u-taro",
              }),
            ],
            nextCursor: "page-2",
          });
        }),
        userDetailsHandler(),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() =>
      expect(canvas.getByText("1ページ目の投稿")).toBeInTheDocument(),
    );
    await userEvent.click(canvas.getByRole("button", { name: "さらに読む" }));
    await waitFor(() =>
      expect(canvas.getByText("2ページ目の投稿")).toBeInTheDocument(),
    );
  },
};

export const Likers: Story = {
  name: "いいねボタンといいねした人の一覧を出す",
  parameters: {
    msw: {
      handlers: [
        http.get("*/pd", () =>
          HttpResponse.json({
            items: [
              rawPd({
                id: "pd-1",
                content: "いいねが付いた投稿",
                userId: "u-taro",
                likes: [{ userId: "u-hanako" }],
              }),
            ],
          }),
        ),
        userDetailsHandler(),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() =>
      expect(canvas.getByText("いいねが付いた投稿")).toBeInTheDocument(),
    );

    const likeButton = canvas.getByRole("button", {
      name: "1件のいいね、未いいね",
    });
    expect(likeButton).toHaveAttribute("aria-pressed", "false");

    await userEvent.click(
      canvas.getByRole("button", { name: "いいねした人を表示" }),
    );
    await waitFor(() =>
      expect(within(document.body).getByText("花子 鈴木")).toBeInTheDocument(),
    );
  },
};

const LONG_NAME_USERS = [
  userDetail(
    "u-long",
    "とてもながいなまえのてすとゆーざー名前名前名前名前名前",
    "苗字苗字苗字苗字苗字苗字苗字苗字苗字苗字苗字苗字",
    "very_long_user_name_that_should_be_truncated_in_the_layout_somewhere",
  ),
];

const LONG_BODY = `改行や空白の無い長い文字列が折り返されるか: ${"abcdefghij".repeat(40)}`;

export const LongContent: Story = {
  name: "長い名前・ユーザー名・本文の表示",
  parameters: {
    msw: {
      handlers: [
        http.get("*/pd", () =>
          HttpResponse.json({
            items: [
              rawPd({
                id: "pd-long",
                content: LONG_BODY,
                userId: "u-long",
                replyCount: 12345,
              }),
            ],
          }),
        ),
        http.get("*/user/details", () => HttpResponse.json(LONG_NAME_USERS)),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() =>
      expect(canvas.getByText(LONG_BODY)).toBeInTheDocument(),
    );
  },
};

export const MultilineAndLinks: Story = {
  name: "改行とURL自動リンクの表示",
  parameters: {
    msw: {
      handlers: [
        http.get("*/pd", () =>
          HttpResponse.json({
            items: [
              rawPd({
                id: "pd-ml",
                content:
                  "1行目です\n2行目です\n詳しくは https://example.com/articles/123 を見てください",
                userId: "u-taro",
              }),
            ],
          }),
        ),
        userDetailsHandler(),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() =>
      expect(canvas.getByText(/1行目です/)).toBeInTheDocument(),
    );
    const link = canvas.getByRole("link", {
      name: "https://example.com/articles/123",
    });
    expect(link).toHaveAttribute("href", "https://example.com/articles/123");
  },
};

export const ManyItems: Story = {
  name: "大量の投稿が並ぶ",
  parameters: {
    msw: {
      handlers: [
        http.get("*/pd", () =>
          HttpResponse.json({
            items: Array.from({ length: 30 }, (_, index) =>
              rawPd({
                id: `pd-many-${index}`,
                content: `投稿 ${index + 1} 件目`,
                userId: index % 2 === 0 ? "u-taro" : "u-hanako",
              }),
            ),
          }),
        ),
        userDetailsHandler(),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() =>
      expect(canvas.getByText("投稿 1 件目")).toBeInTheDocument(),
    );
    expect(canvas.getByText("投稿 30 件目")).toBeInTheDocument();
  },
};

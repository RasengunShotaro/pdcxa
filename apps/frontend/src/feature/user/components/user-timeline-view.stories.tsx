import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HttpResponse, http } from "msw";
import { expect, waitFor, within } from "storybook/test";
import { UserTimelineView } from "./user-timeline-view";

interface RawLike {
  userId: string;
}

const rawPd = (overrides: {
  id: string;
  content: string;
  userId: string;
  likes?: RawLike[];
  replyCount?: number;
}) => ({
  id: overrides.id,
  content: overrides.content,
  userId: overrides.userId,
  createdAt: "2026-06-24T00:00:00.000Z",
  imageFileName: null,
  likeCount: overrides.likes?.length ?? 0,
  replyCount: overrides.replyCount ?? 0,
  likes: overrides.likes ?? [],
  isMyPd: false,
});

const USERS = [
  {
    id: "u-taro",
    firstName: "太郎",
    lastName: "山田",
    imageUrl: "",
    userName: "taro",
  },
];

const userDetailsHandler = () =>
  http.get("*/user/details", () => HttpResponse.json(USERS));

const meta: Meta<typeof UserTimelineView> = {
  title: "ユーザー/UserTimelineView",
  component: UserTimelineView,
  parameters: { layout: "padded" },
  args: { userName: "taro" },
};

export default meta;

type Story = StoryObj<typeof UserTimelineView>;

export const Populated: Story = {
  name: "ヘッダーと本人の PD が並ぶ",
  parameters: {
    msw: {
      handlers: [
        http.get("*/pd", () =>
          HttpResponse.json({
            items: [
              rawPd({
                id: "pd-1",
                content: "太郎の現場メモです",
                userId: "u-taro",
                replyCount: 1,
              }),
              rawPd({
                id: "pd-2",
                content: "もう一件の投稿",
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
      expect(canvas.getByText("太郎の現場メモです")).toBeInTheDocument(),
    );
    const heading = canvas.getByRole("heading", {
      level: 1,
      name: "太郎 山田",
    });
    expect(heading.parentElement).toHaveTextContent("@taro");
    expect(canvas.getByText("もう一件の投稿")).toBeInTheDocument();
  },
};

export const Empty: Story = {
  name: "投稿が無いときヘッダーと空状態を出す",
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
      expect(canvas.getByText("まだ投稿がありません")).toBeInTheDocument(),
    );
    expect(
      canvas.getByRole("heading", { level: 1, name: "@taro" }),
    ).toBeInTheDocument();
  },
};

export const FetchFailed: Story = {
  name: "取得に失敗してもヘッダーは残り再試行を出す",
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
    expect(
      canvas.getByRole("heading", { level: 1, name: "@taro" }),
    ).toBeInTheDocument();
    expect(canvas.getByRole("button", { name: "再試行" })).toBeInTheDocument();
  },
};

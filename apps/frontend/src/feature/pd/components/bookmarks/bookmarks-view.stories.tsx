import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HttpResponse, http } from "msw";
import { expect, waitFor, within } from "storybook/test";
import { BookmarksView } from "./bookmarks-view";

const rawPd = (id: string, content: string) => ({
  id,
  content,
  userId: "u-taro",
  createdAt: "2026-06-24T00:00:00.000Z",
  imageFileName: null,
  likeCount: 0,
  replyCount: 0,
  likes: [],
  isMyPd: false,
  isBookmarked: true,
});

const handlers = (items: ReturnType<typeof rawPd>[]) => [
  http.get("*/pd/bookmarks", () => HttpResponse.json({ items })),
  http.get("*/notifications", () => HttpResponse.json({ items: [] })),
  http.get("*/user/details", () =>
    HttpResponse.json([
      {
        id: "u-taro",
        firstName: "太郎",
        lastName: "山田",
        imageUrl: "",
        userName: "taro",
      },
    ]),
  ),
];

const meta: Meta<typeof BookmarksView> = {
  title: "保存/BookmarksView",
  component: BookmarksView,
  parameters: { layout: "padded" },
};

export default meta;

type Story = StoryObj<typeof BookmarksView>;

export const Populated: Story = {
  name: "保存した PD が保存済みの状態で並ぶ",
  parameters: {
    msw: { handlers: handlers([rawPd("pd-1", "あとで読み返したいメモ")]) },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(() =>
      expect(canvas.getByText("あとで読み返したいメモ")).toBeInTheDocument(),
    );

    expect(canvas.getByRole("button", { name: "保存を外す" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  },
};

export const Empty: Story = {
  name: "保存が無いときは保存の仕方を伝える",
  parameters: { msw: { handlers: handlers([]) } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(() =>
      expect(
        canvas.getByText(
          "保存した PD はまだありません。PD の右下のしおりから保存できます",
        ),
      ).toBeInTheDocument(),
    );
  },
};

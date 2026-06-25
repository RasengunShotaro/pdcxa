import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HttpResponse, http } from "msw";
import { expect, waitFor, within } from "storybook/test";
import { NotificationPanel } from "./notification-panel";

const seenHandler = () =>
  http.post("*/notifications/seen", () => HttpResponse.json({ ok: true }));

const meta: Meta<typeof NotificationPanel> = {
  title: "通知/NotificationPanel",
  component: NotificationPanel,
  parameters: { layout: "padded" },
};

export default meta;

type Story = StoryObj<typeof NotificationPanel>;

export const Populated: Story = {
  name: "反応一覧とすべて見る導線を出す",
  parameters: {
    msw: {
      handlers: [
        http.get("*/notifications", () =>
          HttpResponse.json({
            items: [
              {
                kind: "pdLike",
                actor: {
                  id: "taro",
                  firstName: "太郎",
                  lastName: "山田",
                  imageUrl: "",
                  userName: "taro",
                },
                pdId: "pd-1",
                rePdId: null,
                excerpt: "今日の現場メモを共有します",
                createdAt: "2026-06-24T00:00:00.000Z",
              },
            ],
          }),
        ),
        seenHandler(),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(() =>
      expect(canvas.getByText("太郎 山田")).toBeInTheDocument(),
    );
    await expect(
      canvas.getByRole("link", { name: "すべての通知を見る" }),
    ).toBeInTheDocument();
  },
};

export const Empty: Story = {
  name: "反応が無いとき空状態を出す",
  parameters: {
    msw: {
      handlers: [
        http.get("*/notifications", () => HttpResponse.json({ items: [] })),
        seenHandler(),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(() =>
      expect(canvas.getByText("まだ反応はありません")).toBeInTheDocument(),
    );
  },
};

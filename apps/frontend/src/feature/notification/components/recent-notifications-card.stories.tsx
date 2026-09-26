import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HttpResponse, http } from "msw";
import { expect, waitFor, within } from "storybook/test";
import { RecentNotificationsCard } from "./recent-notifications-card";

const rawNotification = (index: number) => ({
  kind: "pdLike" as const,
  actor: {
    id: `user-${index}`,
    firstName: `利用者${index}`,
    lastName: null,
    imageUrl: "",
    userName: `user${index}`,
  },
  pdId: `pd-${index}`,
  rePdId: null,
  excerpt: `PD ${index}`,
  createdAt: "2026-06-24T00:00:00.000Z",
});

const meta: Meta<typeof RecentNotificationsCard> = {
  title: "通知/RecentNotificationsCard",
  component: RecentNotificationsCard,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="w-[300px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof RecentNotificationsCard>;

export const LimitedToFive: Story = {
  name: "新しい反応を5件まで並べる",
  parameters: {
    msw: {
      handlers: [
        http.get("*/notifications", () =>
          HttpResponse.json({
            items: [1, 2, 3, 4, 5, 6, 7].map(rawNotification),
          }),
        ),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(() =>
      expect(canvas.getByText("利用者1")).toBeInTheDocument(),
    );

    expect(canvas.queryByText("利用者6")).not.toBeInTheDocument();
  },
};

export const Empty: Story = {
  name: "反応が無いときはまだ無いことを伝える",
  parameters: {
    msw: {
      handlers: [
        http.get("*/notifications", () => HttpResponse.json({ items: [] })),
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

export const LinksToAllNotifications: Story = {
  name: "すべての通知ページへ進める",
  parameters: LimitedToFive.parameters,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(
      canvas.getByRole("link", { name: "すべての通知を見る" }),
    ).toHaveAttribute("href", "/notifications");
  },
};

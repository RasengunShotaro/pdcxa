import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import { UserBadges } from "./user-badges";

const meta: Meta<typeof UserBadges> = {
  title: "ユーザー/UserBadges",
  component: UserBadges,
  parameters: {
    layout: "padded",
  },
};
export default meta;

type Story = StoryObj<typeof UserBadges>;

export const Originator: Story = {
  name: "初代様バッジを表示する",
  args: {
    badgeIds: ["originator"],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const badge = canvas.getByText("初代様");

    await userEvent.hover(badge);

    await expect(
      await within(document.body).findByRole("tooltip"),
    ).toHaveTextContent("PowerApps 版 PDCXA の作者");
  },
};

export const UnknownBadge: Story = {
  name: "知らないバッジ ID は表示しない",
  args: {
    badgeIds: ["unknown"],
  },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.textContent).toBe("");
  },
};

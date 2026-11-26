import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { BackLink } from "./back-link";

const meta: Meta<typeof BackLink> = {
  title: "PD詳細/BackLink",
  component: BackLink,
  parameters: { layout: "padded" },
};

export default meta;

type Story = StoryObj<typeof BackLink>;

export const FallsBackToHome: Story = {
  name: "戻り先が無いときに備えてホームへのリンクになっている",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const link = canvas.getByRole("link", { name: "戻る" });

    await expect(link).toHaveAttribute("href", "/");
  },
};

export const ReturnsToGivenTab: Story = {
  name: "戻り先のタブを指定すると、そのタブへのリンクになる",
  args: { href: "/bookmarks" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const link = canvas.getByRole("link", { name: "戻る" });

    await expect(link).toHaveAttribute("href", "/bookmarks");
  },
};

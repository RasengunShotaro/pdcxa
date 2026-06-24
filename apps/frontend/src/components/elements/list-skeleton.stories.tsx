import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { ListSkeleton } from "./list-skeleton";

const meta: Meta<typeof ListSkeleton> = {
  title: "共通/ListSkeleton",
  component: ListSkeleton,
  parameters: {
    layout: "padded",
  },
};
export default meta;

type Story = StoryObj<typeof ListSkeleton>;

export const Default: Story = {
  name: "読み込み中であることを支援技術に伝える",
  args: {
    count: 3,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("status", { name: "読み込み中" }),
    ).toBeInTheDocument();
  },
};

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { Button } from "@/components/ui/button";
import { EmptyState } from "./empty-state";

const meta: Meta<typeof EmptyState> = {
  title: "共通/EmptyState",
  component: EmptyState,
  parameters: {
    layout: "padded",
  },
};
export default meta;

type Story = StoryObj<typeof EmptyState>;

export const MessageOnly: Story = {
  name: "メッセージだけの空状態を表示する",
  args: {
    message: "まだRePDはありません",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("まだRePDはありません")).toBeInTheDocument();
  },
};

export const WithCallToAction: Story = {
  name: "空状態から最初の投稿へ誘導する",
  args: {
    message: "まだPDがありません",
    action: <Button>最初のPDをしてみよう</Button>,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("まだPDがありません")).toBeInTheDocument();
    await expect(
      canvas.getByRole("button", { name: "最初のPDをしてみよう" }),
    ).toBeInTheDocument();
  },
};

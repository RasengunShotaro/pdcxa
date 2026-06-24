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
    message: "まだ RePd はありません",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByText("まだ RePd はありません"),
    ).toBeInTheDocument();
  },
};

export const WithCallToAction: Story = {
  name: "空状態から最初の投稿へ誘導する",
  args: {
    message: "まだ PD がありません",
    action: <Button>最初の PD をしてみよう</Button>,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("まだ PD がありません")).toBeInTheDocument();
    await expect(
      canvas.getByRole("button", { name: "最初の PD をしてみよう" }),
    ).toBeInTheDocument();
  },
};

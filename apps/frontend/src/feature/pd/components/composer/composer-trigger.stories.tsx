import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { ComposerTrigger } from "./composer-trigger";

const meta: Meta<typeof ComposerTrigger> = {
  title: "ホーム/ComposerTrigger",
  component: ComposerTrigger,
  parameters: { layout: "padded" },
  args: {
    label: "PDする",
    placeholder: "いま考えていること・気づいたことを書いてみよう",
    onClick: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof ComposerTrigger>;

export const OpensComposer: Story = {
  name: "入力欄を押すと投稿画面を開く",
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: "PDする" }));

    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

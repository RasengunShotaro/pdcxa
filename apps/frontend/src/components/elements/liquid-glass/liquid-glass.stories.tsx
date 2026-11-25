import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { LiquidGlass } from "./liquid-glass";

const meta: Meta<typeof LiquidGlass> = {
  title: "共通/LiquidGlass",
  component: LiquidGlass,
  args: { radius: 28 },
  parameters: { layout: "fullscreen" },
  render: (args) => (
    <div className="relative grid min-h-96 place-items-center bg-[url('/bg-2.webp')] bg-cover bg-center p-12">
      <div className="relative isolate flex h-14 items-center gap-2 rounded-full px-6 text-base font-semibold text-foreground">
        <LiquidGlass {...args} />
        ガラス越しに背景が曲がって見える
      </div>
    </div>
  ),
};
export default meta;

type Story = StoryObj<typeof LiquidGlass>;

export const OverPhoto: Story = {
  name: "写真の上に置いても、ガラスの上の文字が読める",
  args: { radius: 28 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(
      canvas.getByText("ガラス越しに背景が曲がって見える"),
    ).toBeVisible();
  },
};

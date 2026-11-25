import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { PdBody } from "./pd-body";

const MANY_LINES = Array.from({ length: 40 }, (_, i) => `${i + 1}行目`).join(
  "\n",
);

const meta: Meta<typeof PdBody> = {
  title: "ホーム/PdBody",
  component: PdBody,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="flex w-[36rem] flex-col gap-0.5">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof PdBody>;

export const LongBody: Story = {
  name: "長い本文も折りたたまずに全文を出す",
  args: { content: MANY_LINES },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const body = canvas.getByText(/40行目/);

    await expect(body.scrollHeight).toBe(body.clientHeight);
  },
};

export const ShortBody: Story = {
  name: "短い本文をそのまま出す",
  args: { content: "今日学んだことを共有します" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("今日学んだことを共有します")).toBeVisible();
  },
};

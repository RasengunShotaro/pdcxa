import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
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
  name: "長い本文は折りたたみ、続きを読むで全文を出す",
  args: { content: MANY_LINES },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const readMore = await canvas.findByRole("button", { name: "続きを読む" });
    const body = canvas.getByText(/40行目/);
    const clampedHeight = body.clientHeight;
    await expect(body.scrollHeight).toBeGreaterThan(clampedHeight);

    await userEvent.click(readMore);

    await expect(
      canvas.queryByRole("button", { name: "続きを読む" }),
    ).not.toBeInTheDocument();
    await expect(body.clientHeight).toBeGreaterThan(clampedHeight);
    await expect(body.scrollHeight).toBe(body.clientHeight);
  },
};

export const ShortBody: Story = {
  name: "短い本文には続きを読むを出さない",
  args: { content: "今日学んだことを共有します" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("今日学んだことを共有します")).toBeVisible();
    await expect(
      canvas.queryByRole("button", { name: "続きを読む" }),
    ).not.toBeInTheDocument();
  },
};

export const Unclamped: Story = {
  name: "詳細画面では長い本文も折りたたまない",
  args: { content: MANY_LINES, clamp: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText(/40行目/)).toBeVisible();
    await expect(
      canvas.queryByRole("button", { name: "続きを読む" }),
    ).not.toBeInTheDocument();
  },
};

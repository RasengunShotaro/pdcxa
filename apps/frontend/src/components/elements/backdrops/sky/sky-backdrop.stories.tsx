import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, waitFor, within } from "storybook/test";
import { SkyBackdrop } from "./sky-backdrop";

const meta: Meta<typeof SkyBackdrop> = {
  title: "共通/背景/SkyBackdrop",
  component: SkyBackdrop,
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="relative isolate grid min-h-dvh place-items-center">
      <SkyBackdrop />
      <p className="rounded-2xl border border-border bg-card px-6 py-4 text-sm text-card-foreground">
        空の上に置いた文字が読める
      </p>
    </div>
  ),
};
export default meta;

type Story = StoryObj<typeof SkyBackdrop>;

export const BehindContent: Story = {
  name: "空を敷いても、手前の文字が読める",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(() =>
      expect(
        canvasElement.querySelector("[data-sky-backend]"),
      ).not.toHaveAttribute("data-sky-backend", "loading"),
    );

    await expect(canvas.getByText("空の上に置いた文字が読める")).toBeVisible();
  },
};

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { toast } from "sonner";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Button } from "@/components/ui/button";

const TOAST_KINDS = [
  { label: "成功", show: () => toast.success("PDを投稿しました") },
  { label: "エラー", show: () => toast.error("通信に失敗しました") },
  {
    label: "警告",
    show: () => toast.warning("少し時間をおいて再試行してください"),
  },
  { label: "お知らせ", show: () => toast.info("新しいRePdがあります") },
  { label: "種類なし", show: () => toast("コピーしました") },
] as const;

function ToastPlayground() {
  return (
    <div className="flex flex-wrap gap-2">
      {TOAST_KINDS.map(({ label, show }) => (
        <Button key={label} onClick={show} type="button" variant="outline">
          {label}
        </Button>
      ))}
    </div>
  );
}

const meta: Meta<typeof ToastPlayground> = {
  title: "共通/Toast",
  component: ToastPlayground,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof ToastPlayground>;

const rootFontSizePx = (): number =>
  Number.parseFloat(getComputedStyle(document.documentElement).fontSize);

const expectLargeToastText = async (message: string) => {
  await waitFor(() => {
    const toastItem = document.querySelector<HTMLElement>(
      `[data-sonner-toast]:has([data-title])`,
    );
    expect(toastItem).toHaveTextContent(message);
    expect(
      Number.parseFloat(getComputedStyle(toastItem ?? document.body).fontSize),
    ).toBeGreaterThan(rootFontSizePx());
  });
};

export const Default: Story = {
  name: "種類ごとのトーストを出せる",
};

export const SuccessIsLarge: Story = {
  name: "成功のトーストは本文より大きな文字で出る",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: "成功" }));

    await expectLargeToastText("PDを投稿しました");
  },
};

export const ErrorIsLarge: Story = {
  name: "エラーのトーストは本文より大きな文字で出る",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: "エラー" }));

    await expectLargeToastText("通信に失敗しました");
  },
};

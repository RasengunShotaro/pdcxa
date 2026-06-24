import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { ApiError } from "@/lib/api-error";
import { ListError } from "./list-error";

const meta: Meta<typeof ListError> = {
  title: "共通/ListError",
  component: ListError,
  parameters: {
    layout: "padded",
  },
};
export default meta;

type Story = StoryObj<typeof ListError>;

export const Retryable: Story = {
  name: "通信失敗では再試行ボタンを押すと再取得を促す",
  args: {
    error: new ApiError(503),
    onRetry: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByText("通信に失敗しました。再試行してください"),
    ).toBeInTheDocument();

    await userEvent.click(canvas.getByRole("button", { name: "再試行" }));

    await expect(args.onRetry).toHaveBeenCalledOnce();
  },
};

export const Fatal: Story = {
  name: "想定外のエラーでは予期しないエラー文言を表示する",
  args: {
    error: new ApiError(404),
    onRetry: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByText("予期しないエラーが発生しました"),
    ).toBeInTheDocument();
  },
};

export const AuthRequired: Story = {
  name: "未ログインでは再試行ボタンを出さずにログインを促す",
  args: {
    error: new ApiError(401),
    onRetry: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("ログインが必要です")).toBeInTheDocument();
    await expect(
      canvas.queryByRole("button", { name: "再試行" }),
    ).not.toBeInTheDocument();
  },
};

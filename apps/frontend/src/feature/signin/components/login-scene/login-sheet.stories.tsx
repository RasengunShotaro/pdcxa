import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { LoginSheet } from "./login-sheet";

const meta: Meta<typeof LoginSheet> = {
  title: "サインイン/LoginSheet",
  component: LoginSheet,
  parameters: { layout: "centered" },
  args: {
    title: "ログイン",
    description: "メールアドレスとパスワードを入力してください。",
    children: <p className="px-1 text-sm">フォームがここに入る</p>,
  },
};

export default meta;

type Story = StoryObj<typeof LoginSheet>;

export const Default: Story = {
  name: "見出しと説明を出し、見出しでシートに名前を付ける",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const sheet = canvas.getByRole("region", { name: "ログイン" });

    expect(sheet).toHaveTextContent(
      "メールアドレスとパスワードを入力してください。",
    );
  },
};

export const WithFooter: Story = {
  name: "フッターを渡すとフォームの下に出す",
  args: {
    footer: <a href="/signin/reset-password">パスワードを忘れた場合</a>,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const link = canvas.getByRole("link", { name: "パスワードを忘れた場合" });

    expect(link).toBeVisible();
  },
};

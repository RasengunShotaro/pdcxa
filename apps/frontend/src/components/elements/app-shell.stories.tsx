import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { AppShell } from "./app-shell";

const meta: Meta<typeof AppShell> = {
  title: "共通/AppShell",
  component: AppShell,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    userFooter: <span>U</span>,
    children: <p>メインコンテンツ</p>,
  },
};
export default meta;

type Story = StoryObj<typeof AppShell>;

export const Home: Story = {
  name: "ホームでは現在地としてホームを示す",
  parameters: {
    nextjs: { navigation: { pathname: "/" } },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(
      canvas.getByRole("link", { name: "コンテンツへスキップ" }),
    ).toBeInTheDocument();
    await expect(
      canvas.getByRole("navigation", { name: "メインナビゲーション" }),
    ).toBeInTheDocument();

    await expect(canvas.getByRole("link", { name: "ホーム" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  },
};

export const Stats: Story = {
  name: "統計ページでは現在地として統計を示す",
  parameters: {
    nextjs: { navigation: { pathname: "/stats" } },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole("link", { name: "統計" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await expect(
      canvas.getByRole("link", { name: "ホーム" }),
    ).not.toHaveAttribute("aria-current");
  },
};

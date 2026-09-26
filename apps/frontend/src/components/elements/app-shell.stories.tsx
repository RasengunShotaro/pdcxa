import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import { AppShell } from "./app-shell";

const meta: Meta<typeof AppShell> = {
  title: "共通/AppShell",
  component: AppShell,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    userFooter: <span>U</span>,
    headerActions: <span>🔔</span>,
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

export const LongUnbreakableContent: Story = {
  name: "1行に収まらない長い名前があっても画面の横幅からはみ出さない",
  parameters: {
    nextjs: { navigation: { pathname: "/" } },
  },
  args: {
    children: (
      <div className="flex min-w-0 items-center gap-3">
        <p className="min-w-0 truncate">{"とても長い表示名".repeat(40)}</p>
        <span className="ml-auto shrink-0">6月26日</span>
      </div>
    ),
  },
  play: async ({ canvasElement }) => {
    const root = canvasElement.ownerDocument.documentElement;

    await expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth);
  },
};

export const CollapseSidebar: Story = {
  name: "サイドバー下部のボタンでサイドバーを閉じられる",
  parameters: {
    nextjs: { navigation: { pathname: "/" } },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(
      canvas.getByRole("button", { name: "サイドバーを閉じる" }),
    );

    await expect(
      canvas.getByRole("button", { name: "サイドバーを開く" }),
    ).toHaveAttribute("aria-expanded", "false");
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

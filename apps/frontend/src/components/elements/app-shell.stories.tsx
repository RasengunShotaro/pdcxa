import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { AppShell } from "./app-shell";

const meta: Meta<typeof AppShell> = {
  title: "共通/AppShell",
  component: AppShell,
  parameters: {
    layout: "fullscreen",
    viewport: {
      options: {
        desktop: {
          name: "PC",
          styles: { width: "1440px", height: "900px" },
          type: "desktop",
        },
      },
    },
  },
  globals: { viewport: { value: "desktop" } },
  args: {
    userFooter: <span>U</span>,
    backdrop: null,
    children: <p>メインコンテンツ</p>,
  },
};
export default meta;

type Story = StoryObj<typeof AppShell>;

const mainNav = (canvasElement: HTMLElement) =>
  within(
    within(canvasElement).getByRole("navigation", {
      name: "メインナビゲーション",
    }),
  );

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
      mainNav(canvasElement).getByRole("link", { name: "ホーム" }),
    ).toHaveAttribute("aria-current", "page");
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

export const ComposeFromSidebar: Story = {
  name: "サイドバーの PDする を押すと、画面を移らずに投稿の入力が開く",
  parameters: {
    nextjs: { navigation: { pathname: "/" } },
  },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);

    await userEvent.click(
      mainNav(canvasElement).getByRole("button", { name: "PDする" }),
    );

    const dialog = await body.findByRole("dialog", { name: "PDする" });
    await waitFor(() => expect(dialog).toBeVisible());
  },
};

export const InvitationOpensAsSheet: Story = {
  name: "サイドバーの招待を押すと、画面を移らずに招待のシートが開く",
  parameters: {
    nextjs: { navigation: { pathname: "/" } },
  },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);

    await userEvent.click(
      mainNav(canvasElement).getByRole("button", { name: "招待" }),
    );

    const dialog = await body.findByRole("dialog", { name: "PDCXAに招待する" });
    await waitFor(() => expect(dialog).toBeVisible());
  },
};

export const NoProfileInSidebar: Story = {
  name: "サイドバーにはプロフィールを並べない",
  parameters: {
    nextjs: { navigation: { pathname: "/" } },
  },
  play: async ({ canvasElement }) => {
    await expect(
      mainNav(canvasElement).queryByRole("button", { name: "プロフィール" }),
    ).toBeNull();
  },
};

export const BookmarksInSidebar: Story = {
  name: "サイドバーの保存済みから、保存した PD の一覧へ進める",
  parameters: {
    nextjs: { navigation: { pathname: "/" } },
  },
  play: async ({ canvasElement }) => {
    await expect(
      mainNav(canvasElement).getByRole("link", { name: "保存済み" }),
    ).toHaveAttribute("href", "/bookmarks");
  },
};

export const PageTitle: Story = {
  name: "列を持たない画面ではページ名を見出しとして出す",
  parameters: {
    nextjs: { navigation: { pathname: "/stats" } },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(
      canvas.getByRole("heading", { level: 1, name: "統計" }),
    ).toBeVisible();
  },
};

export const Stats: Story = {
  name: "統計ページでは現在地として統計を示す",
  parameters: {
    nextjs: { navigation: { pathname: "/stats" } },
  },
  play: async ({ canvasElement }) => {
    const nav = mainNav(canvasElement);

    await expect(nav.getByRole("link", { name: "統計" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await expect(nav.getByRole("link", { name: "ホーム" })).not.toHaveAttribute(
      "aria-current",
    );
  },
};

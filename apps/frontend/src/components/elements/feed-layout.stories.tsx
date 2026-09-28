import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { AppShell } from "./app-shell";
import { FeedLayout } from "./feed-layout";
import { TIMELINE_TABS } from "./nav-items";

const PD_LABELS = Array.from({ length: 40 }, (_, index) => `PD ${index + 1}`);

function LongFeed() {
  return (
    <AppShell userFooter={<span>U</span>}>
      <FeedLayout
        aside={<p className="h-40 rounded-lg border p-4">今週の活動</p>}
        tabs={TIMELINE_TABS}
      >
        {PD_LABELS.map((label) => (
          <p className="h-24 border-b border-border px-4 py-3" key={label}>
            {label}
          </p>
        ))}
      </FeedLayout>
    </AppShell>
  );
}

const meta: Meta<typeof LongFeed> = {
  title: "共通/FeedLayout",
  component: LongFeed,
  parameters: {
    layout: "fullscreen",
    nextjs: { navigation: { pathname: "/" } },
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
};
export default meta;

type Story = StoryObj<typeof LongFeed>;

const scrollFeedDown = async (canvasElement: HTMLElement) => {
  canvasElement.ownerDocument.defaultView?.scrollTo(0, 2000);
  for (const element of canvasElement.querySelectorAll<HTMLElement>("*")) {
    if (element.scrollHeight > element.clientHeight + 100) {
      element.scrollTop = 2000;
    }
  }
  await new Promise((resolve) => requestAnimationFrame(resolve));
};

export const TabsStayOnScroll: Story = {
  name: "下へスクロールしてもホームと通知の切り替えは画面上部に残る",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const tabs = canvas.getByRole("navigation", {
      name: "タイムラインの切り替え",
    });

    await scrollFeedDown(canvasElement);

    await expect(Math.round(tabs.getBoundingClientRect().top)).toBe(0);
  },
};

export const AsideStaysOnScroll: Story = {
  name: "下へスクロールしても右列の今週の活動は画面内に残る",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const aside = canvas.getByText("今週の活動");

    await scrollFeedDown(canvasElement);

    await expect(aside.getBoundingClientRect().top).toBeGreaterThanOrEqual(0);
  },
};

export const HomeTabIsCurrent: Story = {
  name: "ホームではホームのタブが選ばれている",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const tabs = within(
      canvas.getByRole("navigation", { name: "タイムラインの切り替え" }),
    );

    await expect(tabs.getByRole("link", { name: "ホーム" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  },
};

export const NotificationsTabIsCurrent: Story = {
  name: "通知では通知のタブが選ばれ、ホームのタブからホームへ戻れる",
  parameters: {
    nextjs: { navigation: { pathname: "/notifications" } },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const tabs = within(
      canvas.getByRole("navigation", { name: "タイムラインの切り替え" }),
    );

    await expect(tabs.getByRole("link", { name: "通知" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await expect(tabs.getByRole("link", { name: "ホーム" })).toHaveAttribute(
      "href",
      "/",
    );
  },
};

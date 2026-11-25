import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { AppShell } from "./app-shell";
import { FeedSurface } from "./feed-layout";
import type { 一覧と詳細の幅 } from "./feed-layout-cookie";

const PD_LABELS = Array.from({ length: 40 }, (_, index) => `PD ${index + 1}`);

interface LongFeedProps {
  savedLayout?: 一覧と詳細の幅;
}

function LongFeed({ savedLayout }: LongFeedProps) {
  return (
    <AppShell backdrop={null} userFooter={<span>U</span>}>
      <FeedSurface
        savedLayout={savedLayout}
        list={PD_LABELS.map((label) => (
          <p className="h-24 px-4 py-3" key={label}>
            {label}
          </p>
        ))}
      >
        <p>開いているPDの詳細</p>
      </FeedSurface>
    </AppShell>
  );
}

const meta: Meta<typeof LongFeed> = {
  title: "共通/FeedSurface",
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

    const top = tabs.getBoundingClientRect().top;
    await expect(top >= 0 && top < 48).toBe(true);
  },
};

export const DetailStaysOnScroll: Story = {
  name: "一覧を下へスクロールしても、開いている PD の詳細は画面内に残る",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const detail = canvas.getByText("開いているPDの詳細");

    await scrollFeedDown(canvasElement);

    await expect(detail.getBoundingClientRect().top).toBeGreaterThanOrEqual(0);
  },
};

export const ResizeListWithKeyboard: Story = {
  name: "一覧と詳細の境目で、一覧の幅を広げられる",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const list = canvas.getByRole("region", { name: "タイムライン" });
    const handle = canvas.getByRole("separator", {
      name: "一覧と詳細の幅を変える",
    });
    const before = list.getBoundingClientRect().width;

    handle.focus();
    await userEvent.keyboard("{ArrowRight}{ArrowRight}{ArrowRight}");

    await waitFor(() =>
      expect(list.getBoundingClientRect().width).toBeGreaterThan(before),
    );
  },
};

export const OpensWithSavedWidth: Story = {
  name: "前に広げた一覧の幅で開く",
  args: { savedLayout: { list: 60, detail: 40 } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const list = canvas.getByRole("region", { name: "タイムライン" });
    const handle = canvas.getByRole("separator", {
      name: "一覧と詳細の幅を変える",
    });

    await expect(handle).toHaveAttribute("aria-valuenow", "60");
    await expect(list.getBoundingClientRect().width).toBeGreaterThan(600);
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

    await expect(tabs.getByRole("link", { name: /^通知/ })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await expect(tabs.getByRole("link", { name: "ホーム" })).toHaveAttribute(
      "href",
      "/",
    );
  },
};

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import { UserBadges } from "./user-badges";

const meta: Meta<typeof UserBadges> = {
  title: "ユーザー/UserBadges",
  component: UserBadges,
  parameters: {
    layout: "padded",
  },
};
export default meta;

type Story = StoryObj<typeof UserBadges>;

export const Originator: Story = {
  name: "初代様バッジを表示する",
  args: {
    badgeIds: ["originator"],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const badge = canvas.getByText("初代様");

    await userEvent.hover(badge);

    await expect(
      await within(document.body).findByRole("tooltip"),
    ).toHaveTextContent("PowerApps 版 PDCXA の作者");
  },
};

const isVisuallyShown = (element: HTMLElement): boolean =>
  element.getBoundingClientRect().width > 1;

export const LabelShownOnDesktop: Story = {
  name: "PC の画面幅ではバッジ名を文字で出す",
  args: {
    badgeIds: ["originator"],
  },
  globals: { viewport: { value: "desktop" } },
  parameters: {
    viewport: {
      options: {
        desktop: {
          name: "PC",
          styles: { width: "1280px", height: "800px" },
          type: "desktop",
        },
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const label = canvas.getByText("初代様");

    await expect(isVisuallyShown(label)).toBe(true);
  },
};

export const IconOnlyOnMobile: Story = {
  name: "スマホの画面幅ではバッジ名の文字を出さずアイコンだけにする",
  args: {
    badgeIds: ["originator"],
  },
  globals: { viewport: { value: "mobile" } },
  parameters: {
    viewport: {
      options: {
        mobile: {
          name: "スマホ",
          styles: { width: "390px", height: "844px" },
          type: "mobile",
        },
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const label = canvas.getByText("初代様");

    await expect(isVisuallyShown(label)).toBe(false);
  },
};

export const MobileTooltip: Story = {
  name: "スマホの画面幅でもアイコンに触れるとバッジの説明が出る",
  args: {
    badgeIds: ["originator"],
  },
  globals: IconOnlyOnMobile.globals,
  parameters: IconOnlyOnMobile.parameters,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const badge = canvas.getByText("初代様").parentElement ?? canvasElement;

    await userEvent.hover(badge);

    await expect(
      await within(document.body).findByRole("tooltip"),
    ).toHaveTextContent("PowerApps 版 PDCXA の作者");
  },
};

export const UnknownBadge: Story = {
  name: "知らないバッジ ID は表示しない",
  args: {
    badgeIds: ["unknown"],
  },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.textContent).toBe("");
  },
};

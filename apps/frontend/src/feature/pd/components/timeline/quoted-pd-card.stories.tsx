import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import type { QuotedPd } from "@/feature/pd/types";
import { QuotedPdCard } from "./quoted-pd-card";

const aQuotedPd = (badges: string[]): QuotedPd => ({
  id: "pd-1",
  content: "テストは後から書けば十分だと思う",
  createdAt: "2026-03-12T00:00:00.000Z",
  userId: "u-taro",
  userDetail: {
    userFullName: "太郎 山田",
    imageUrl: "",
    userName: "taro",
    badges,
  },
});

const meta: Meta<typeof QuotedPdCard> = {
  title: "ホーム/QuotedPdCard",
  component: QuotedPdCard,
  parameters: { layout: "padded" },
};

export default meta;

type Story = StoryObj<typeof QuotedPdCard>;

export const ShowsAuthorBadge: Story = {
  name: "引用元の投稿者にバッジがあれば名前の横に出る",
  args: { quotedPd: aQuotedPd(["originator"]) },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const link = canvas.getByRole("link");

    await expect(link).toHaveTextContent(/太郎 山田.*初代様/);
  },
};

export const BadgeDescriptionOnHover: Story = {
  name: "引用元の投稿者のバッジに触れるとバッジの説明が出る",
  args: { quotedPd: aQuotedPd(["originator"]) },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.hover(canvas.getByText("初代様"));

    await expect(
      await within(document.body).findByRole("tooltip"),
    ).toHaveTextContent("PowerApps 版 PDCXA の作者");
  },
};

export const BadgeNotSeparateTabStop: Story = {
  name: "引用元へのリンクの中ではバッジにキーボードの移動先を増やさない",
  args: { quotedPd: aQuotedPd(["originator"]) },
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole("link");
    await userEvent.tab();

    await userEvent.tab();

    await expect(link.contains(document.activeElement)).toBe(false);
  },
};

export const WithoutBadge: Story = {
  name: "引用元の投稿者にバッジが無ければバッジを出さない",
  args: { quotedPd: aQuotedPd([]) },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.queryByText("初代様")).not.toBeInTheDocument();
  },
};

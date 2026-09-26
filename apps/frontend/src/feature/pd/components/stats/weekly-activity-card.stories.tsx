import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HttpResponse, http } from "msw";
import { expect, within } from "storybook/test";
import { WeeklyActivityCard } from "./weekly-activity-card";

const range = { start: "2026-06-19", end: "2026-06-25" };

const statsWith = (overrides: {
  totals?: { pdCount: number; rePdCount: number; likeCount: number };
  rankings?: {
    userId: string;
    pdCount: number;
    rePdCount: number;
    likeCount: number;
  }[];
}) => ({
  range,
  totals: {
    pdCount: overrides.totals?.pdCount ?? 20,
    rePdCount: overrides.totals?.rePdCount ?? 8,
    likeCount: overrides.totals?.likeCount ?? 30,
    activeAuthorCount: 4,
    averagePdPerAuthor: 5,
  },
  daily: [],
  rankings: overrides.rankings ?? [
    { userId: "u1", pdCount: 8, rePdCount: 3, likeCount: 12 },
    { userId: "u2", pdCount: 7, rePdCount: 4, likeCount: 11 },
    { userId: "u3", pdCount: 5, rePdCount: 1, likeCount: 7 },
    { userId: "u4", pdCount: 2, rePdCount: 0, likeCount: 1 },
  ],
});

const userDetails = [
  {
    id: "u1",
    firstName: "太郎",
    lastName: "山田",
    userName: "taro",
    imageUrl: "",
  },
  {
    id: "u2",
    firstName: "花子",
    lastName: "鈴木",
    userName: "hanako",
    imageUrl: "",
  },
  {
    id: "u3",
    firstName: "陽",
    lastName: "佐藤",
    userName: "hinata",
    imageUrl: "",
  },
  {
    id: "u4",
    firstName: "蓮",
    lastName: "田中",
    userName: "ren",
    imageUrl: "",
  },
];

const handlers = (stats: ReturnType<typeof statsWith>) => [
  http.get("*/pd/stats/weekly", () => HttpResponse.json(stats)),
  http.get("*/user/details", () => HttpResponse.json(userDetails)),
];

const meta: Meta<typeof WeeklyActivityCard> = {
  title: "統計/WeeklyActivityCard",
  component: WeeklyActivityCard,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="w-[250px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof WeeklyActivityCard>;

export const Populated: Story = {
  name: "今週の PD・RePD・いいねの数を出す",
  parameters: { msw: { handlers: handlers(statsWith({})) } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const pdCount = await canvas.findByText("20");

    expect(pdCount.previousElementSibling).toHaveTextContent("PD");
  },
};

export const TopThreeAuthors: Story = {
  name: "今週よく PD した人を上位 3 人まで並べ、その人のページへ進める",
  parameters: Populated.parameters,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const top = await canvas.findByRole("link", { name: /太郎 山田/ });

    expect(top).toHaveAttribute("href", "/user/taro");
    expect(canvas.queryByText("蓮 田中")).not.toBeInTheDocument();
  },
};

export const NoActivity: Story = {
  name: "今週まだ投稿が無いときはその旨を伝える",
  parameters: {
    msw: {
      handlers: handlers(
        statsWith({
          totals: { pdCount: 0, rePdCount: 0, likeCount: 0 },
          rankings: [],
        }),
      ),
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(
      await canvas.findByText("今週はまだ投稿がありません"),
    ).toBeInTheDocument();
  },
};

export const LinksToStats: Story = {
  name: "統計ページへ進める",
  parameters: Populated.parameters,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByRole("link", { name: "統計を見る" })).toHaveAttribute(
      "href",
      "/stats",
    );
  },
};

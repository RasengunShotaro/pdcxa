import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HttpResponse, http } from "msw";
import { expect, waitFor, within } from "storybook/test";
import {
  getFetchUserDetailsMockHandler,
  getFetchWeeklyStatsMockHandler,
} from "@/schema/api.msw";
import { StatsView } from "./stats-view";

const range = { start: "2026-06-19", end: "2026-06-25" };

const daily = [
  { date: "2026-06-19", pdCount: 3, rePdCount: 1, likeCount: 5 },
  { date: "2026-06-20", pdCount: 2, rePdCount: 0, likeCount: 3 },
  { date: "2026-06-21", pdCount: 4, rePdCount: 2, likeCount: 6 },
  { date: "2026-06-22", pdCount: 1, rePdCount: 1, likeCount: 2 },
  { date: "2026-06-23", pdCount: 5, rePdCount: 2, likeCount: 8 },
  { date: "2026-06-24", pdCount: 3, rePdCount: 1, likeCount: 4 },
  { date: "2026-06-25", pdCount: 2, rePdCount: 1, likeCount: 2 },
];

const populatedStats = {
  range,
  totals: {
    pdCount: 20,
    rePdCount: 8,
    likeCount: 30,
    activeAuthorCount: 3,
    averagePdPerAuthor: 6.7,
  },
  daily,
  rankings: [
    { userId: "u1", pdCount: 8, rePdCount: 3, likeCount: 12 },
    { userId: "u2", pdCount: 7, rePdCount: 4, likeCount: 11 },
    { userId: "u3", pdCount: 5, rePdCount: 1, likeCount: 7 },
  ],
};

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
    firstName: null,
    lastName: null,
    userName: "guest",
    imageUrl: "",
  },
];

const quietStats = {
  range,
  totals: {
    pdCount: 0,
    rePdCount: 0,
    likeCount: 0,
    activeAuthorCount: 0,
    averagePdPerAuthor: 0,
  },
  daily: daily.map((d) => ({
    date: d.date,
    pdCount: 0,
    rePdCount: 0,
    likeCount: 0,
  })),
  rankings: [],
};

const meta: Meta<typeof StatsView> = {
  title: "統計/StatsView",
  component: StatsView,
  decorators: [
    (Story) => (
      <div className="w-[760px] max-w-full p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof StatsView>;

export const Populated: Story = {
  name: "活動のある週はKPI・チャート・ランキングを表示する",
  parameters: {
    msw: {
      handlers: [
        getFetchWeeklyStatsMockHandler(populatedStats),
        getFetchUserDetailsMockHandler(userDetails),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() =>
      expect(canvas.getByText("PD投稿数")).toBeInTheDocument(),
    );
    expect(canvas.getByText("1日平均 2.9件")).toBeInTheDocument();
    expect(canvas.getByText("太郎 山田")).toBeInTheDocument();
    expect(canvas.getByText("@taro")).toBeInTheDocument();
  },
};

export const QuietWeek: Story = {
  name: "静かな週でもゼロ除算せずランキングは空状態を出す",
  parameters: {
    msw: {
      handlers: [
        getFetchWeeklyStatsMockHandler(quietStats),
        getFetchUserDetailsMockHandler([]),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() =>
      expect(
        canvas.getByText("今週はまだ投稿者がいません"),
      ).toBeInTheDocument(),
    );
    expect(
      canvas.getAllByText("PD投稿がまだありません").length,
    ).toBeGreaterThan(0);
    expect(canvas.queryByText(/NaN|Infinity/)).not.toBeInTheDocument();
  },
};

export const FetchFailed: Story = {
  name: "取得に失敗すると再試行ボタン付きエラーを出す",
  parameters: {
    msw: {
      handlers: [
        http.get(
          "*/pd/stats/weekly",
          () => new HttpResponse(null, { status: 500 }),
        ),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() =>
      expect(
        canvas.getByText("通信に失敗しました。再試行してください"),
      ).toBeInTheDocument(),
    );
    expect(canvas.getByRole("button", { name: "再試行" })).toBeInTheDocument();
  },
};

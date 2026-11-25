import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HttpResponse, http } from "msw";
import { expect, userEvent, waitFor, within } from "storybook/test";
import {
  getFetchFootprintMockHandler,
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
    badges: [],
  },
  {
    id: "u2",
    firstName: "花子",
    lastName: "鈴木",
    userName: "hanako",
    imageUrl: "",
    badges: [],
  },
  {
    id: "u3",
    firstName: null,
    lastName: null,
    userName: "guest",
    imageUrl: "",
    badges: [],
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

const footprint = {
  range: { start: "2026-06-23", end: "2026-06-25" },
  days: [
    { date: "2026-06-23", pdCount: 0, rePdCount: 0, likeCount: 0 },
    { date: "2026-06-24", pdCount: 1, rePdCount: 2, likeCount: 3 },
    { date: "2026-06-25", pdCount: 2, rePdCount: 0, likeCount: 5 },
  ],
  currentStreak: 2,
};

const meta: Meta<typeof StatsView> = {
  title: "統計/StatsView",
  component: StatsView,
  decorators: [
    (Story) => (
      <div className="w-full max-w-[1042px] p-4">
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
        getFetchFootprintMockHandler(footprint),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() =>
      expect(canvas.getByText("PD投稿数")).toBeInTheDocument(),
    );
    expect(canvas.getByText("1日平均2.9件")).toBeInTheDocument();
    expect(canvas.getByText("太郎 山田")).toBeInTheDocument();
    expect(canvas.getByText("@taro")).toBeInTheDocument();
  },
};

export const ShowsFootprint: Story = {
  name: "自分のあしあとと、連続して動いた日数を表示する",
  parameters: Populated.parameters,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const heatmap = within(
      await canvas.findByRole("group", { name: "これまでのあしあと" }),
    );

    expect(
      heatmap.getByRole("button", {
        name: "6月25日(木) PD 2件・RePD 0件・いいね 5件",
      }),
    ).toBeInTheDocument();
    expect(
      heatmap.getByRole("button", { name: "6月23日(火) 活動なし" }),
    ).toBeInTheDocument();
    expect(
      canvas.getByText("連続して動いた日").parentElement,
    ).toHaveTextContent("連続して動いた日2日");
  },
};

export const FootprintDayOnHover: Story = {
  name: "あしあとのマスに触れると、その日の日付と件数が出る",
  parameters: Populated.parameters,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const day = await canvas.findByRole("button", {
      name: "6月24日(水) PD 1件・RePD 2件・いいね 3件",
    });

    await userEvent.hover(day);

    await waitFor(() =>
      expect(within(document.body).getByRole("tooltip")).toHaveTextContent(
        "6月24日(水)PD 1件・RePD 2件・いいね 3件",
      ),
    );
  },
};

export const FootprintDayByKeyboard: Story = {
  name: "あしあとは矢印キーで前の日へ移れる",
  parameters: Populated.parameters,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const today = await canvas.findByRole("button", {
      name: "6月25日(木) PD 2件・RePD 0件・いいね 5件",
    });
    today.focus();

    await userEvent.keyboard("{ArrowUp}");

    await waitFor(() =>
      expect(
        canvas.getByRole("button", {
          name: "6月24日(水) PD 1件・RePD 2件・いいね 3件",
        }),
      ).toHaveFocus(),
    );
  },
};

export const FootprintFetchFailed: Story = {
  name: "あしあとだけ取得に失敗しても、週の統計は表示したまま再試行できる",
  parameters: {
    msw: {
      handlers: [
        getFetchWeeklyStatsMockHandler(populatedStats),
        getFetchUserDetailsMockHandler(userDetails),
        http.get(
          "*/pd/stats/footprint",
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

    expect(canvas.getByText("PD投稿数")).toBeInTheDocument();
    expect(canvas.getByRole("button", { name: "再試行" })).toBeInTheDocument();
  },
};

export const CountsUpToTotals: Story = {
  name: "KPIの数値は数え上げた後に今週の合計で止まる",
  parameters: Populated.parameters,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const kpiValue = async (label: string) =>
      (await canvas.findByText(label, { selector: "p" })).nextElementSibling;

    const pd = await kpiValue("PD投稿数");
    const rePd = await kpiValue("RePD数");
    const like = await kpiValue("いいね");
    const author = await kpiValue("アクティブ投稿者");

    await waitFor(() => {
      expect(pd).toHaveTextContent(/^20$/);
      expect(rePd).toHaveTextContent(/^8$/);
      expect(like).toHaveTextContent(/^30$/);
      expect(author).toHaveTextContent(/^3$/);
    });
  },
};

export const QuietWeek: Story = {
  name: "静かな週でもゼロ除算せずランキングは空状態を出す",
  parameters: {
    msw: {
      handlers: [
        getFetchWeeklyStatsMockHandler(quietStats),
        getFetchUserDetailsMockHandler([]),
        getFetchFootprintMockHandler(footprint),
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

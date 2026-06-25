import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HttpResponse, http } from "msw";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { NotificationsView } from "./notifications-view";

const actor = (overrides: {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  userName?: string | null;
}) => ({
  id: overrides.id,
  firstName: overrides.firstName ?? null,
  lastName: overrides.lastName ?? null,
  imageUrl: "",
  userName: overrides.userName ?? null,
});

const rawNotification = (overrides: {
  kind: "pdLike" | "rePdLike" | "rePd";
  actorId: string;
  actorFirstName?: string;
  actorLastName?: string;
  pdId: string;
  rePdId?: string | null;
  excerpt: string;
  createdAt: string;
}) => ({
  kind: overrides.kind,
  actor: actor({
    id: overrides.actorId,
    firstName: overrides.actorFirstName,
    lastName: overrides.actorLastName,
    userName: overrides.actorId,
  }),
  pdId: overrides.pdId,
  rePdId: overrides.rePdId ?? null,
  excerpt: overrides.excerpt,
  createdAt: overrides.createdAt,
});

const seenHandler = () =>
  http.post("*/notifications/seen", () => HttpResponse.json({ ok: true }));

const meta: Meta<typeof NotificationsView> = {
  title: "通知/NotificationsView",
  component: NotificationsView,
  parameters: { layout: "padded" },
};

export default meta;

type Story = StoryObj<typeof NotificationsView>;

export const Populated: Story = {
  name: "反応が時系列で並ぶ",
  parameters: {
    msw: {
      handlers: [
        http.get("*/notifications", () =>
          HttpResponse.json({
            items: [
              rawNotification({
                kind: "rePd",
                actorId: "hanako",
                actorFirstName: "花子",
                actorLastName: "鈴木",
                pdId: "pd-1",
                rePdId: "repd-1",
                excerpt: "とても参考になりました",
                createdAt: "2026-06-24T00:00:00.000Z",
              }),
              rawNotification({
                kind: "pdLike",
                actorId: "taro",
                actorFirstName: "太郎",
                actorLastName: "山田",
                pdId: "pd-1",
                excerpt: "今日のメモを共有します",
                createdAt: "2026-06-23T00:00:00.000Z",
              }),
            ],
          }),
        ),
        seenHandler(),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(() =>
      expect(canvas.getByText("花子 鈴木")).toBeInTheDocument(),
    );
    await expect(
      canvas.getByText("さんがあなたの PD に RePd しました"),
    ).toBeInTheDocument();
    await expect(
      canvas.getByText("さんがあなたの PD にいいねしました"),
    ).toBeInTheDocument();
  },
};

export const Empty: Story = {
  name: "反応が無いとき空状態を出す",
  parameters: {
    msw: {
      handlers: [
        http.get("*/notifications", () => HttpResponse.json({ items: [] })),
        seenHandler(),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(() =>
      expect(canvas.getByText("まだ反応はありません")).toBeInTheDocument(),
    );
  },
};

export const FetchFailed: Story = {
  name: "取得失敗で再試行を促す",
  parameters: {
    msw: {
      handlers: [
        http.get(
          "*/notifications",
          () => new HttpResponse(null, { status: 500 }),
        ),
        seenHandler(),
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
    await expect(
      canvas.getByRole("button", { name: "再試行" }),
    ).toBeInTheDocument();
  },
};

export const LoadMore: Story = {
  name: "さらに読むで続きを読み込む",
  parameters: {
    msw: {
      handlers: [
        http.get("*/notifications", ({ request }) => {
          const cursor = new URL(request.url).searchParams.get("cursor");
          if (cursor === "2026-06-23T00:00:00.000Z") {
            return HttpResponse.json({
              items: [
                rawNotification({
                  kind: "rePd",
                  actorId: "jiro",
                  actorFirstName: "次郎",
                  actorLastName: "佐藤",
                  pdId: "pd-2",
                  rePdId: "repd-2",
                  excerpt: "2ページ目の反応",
                  createdAt: "2026-06-22T00:00:00.000Z",
                }),
              ],
            });
          }
          return HttpResponse.json({
            items: [
              rawNotification({
                kind: "pdLike",
                actorId: "taro",
                actorFirstName: "太郎",
                actorLastName: "山田",
                pdId: "pd-1",
                excerpt: "1ページ目の反応",
                createdAt: "2026-06-23T00:00:00.000Z",
              }),
            ],
            nextCursor: "2026-06-23T00:00:00.000Z",
          });
        }),
        seenHandler(),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(() =>
      expect(canvas.getByText("「1ページ目の反応」")).toBeInTheDocument(),
    );
    await userEvent.click(canvas.getByRole("button", { name: "さらに読む" }));
    await waitFor(() =>
      expect(canvas.getByText("「2ページ目の反応」")).toBeInTheDocument(),
    );
  },
};

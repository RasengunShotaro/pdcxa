import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HttpResponse, http } from "msw";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { PdDetailView } from "./pd-detail-view";

interface RawLike {
  userId: string;
}

const rawPd = (overrides: {
  id: string;
  content: string;
  userId: string;
  likes?: RawLike[];
  replyCount?: number;
}) => ({
  id: overrides.id,
  content: overrides.content,
  userId: overrides.userId,
  createdAt: "2026-06-24T00:00:00.000Z",
  imageFileName: null,
  likeCount: overrides.likes?.length ?? 0,
  replyCount: overrides.replyCount ?? 0,
  likes: overrides.likes ?? [],
  isMyPd: false,
});

const rawRePd = (overrides: {
  id: string;
  content: string;
  userId: string;
  likes?: RawLike[];
}) => ({
  id: overrides.id,
  pdId: "pd-1",
  content: overrides.content,
  userId: overrides.userId,
  createdAt: "2026-06-24T01:00:00.000Z",
  likeCount: overrides.likes?.length ?? 0,
  likes: overrides.likes ?? [],
  isMyRePd: false,
});

const userDetail = (
  id: string,
  firstName: string,
  lastName: string,
  userName: string,
) => ({ id, firstName, lastName, imageUrl: "", userName });

const USERS = [
  userDetail("u-taro", "太郎", "山田", "taro"),
  userDetail("u-hanako", "花子", "鈴木", "hanako"),
  userDetail("u-jiro", "次郎", "佐藤", "jiro"),
];

const userDetailsHandler = () =>
  http.get("*/user/details", () => HttpResponse.json(USERS));

const pdOk = () =>
  http.get("*/pd", () =>
    HttpResponse.json({
      items: [
        rawPd({
          id: "pd-1",
          content: "現場で気づいたことを共有します",
          userId: "u-taro",
          likes: [{ userId: "u-hanako" }],
          replyCount: 2,
        }),
      ],
      nextCursor: null,
    }),
  );

const repdsOk = () =>
  http.get("*/repd", () =>
    HttpResponse.json([
      rawRePd({
        id: "repd-1",
        content: "とても参考になりました",
        userId: "u-hanako",
        likes: [{ userId: "u-jiro" }],
      }),
      rawRePd({
        id: "repd-2",
        content: "私も同じことを感じていました",
        userId: "u-jiro",
      }),
    ]),
  );

const meta: Meta<typeof PdDetailView> = {
  title: "PD詳細/PdDetailView",
  component: PdDetailView,
  parameters: { layout: "padded" },
  args: { pdId: "pd-1" },
};

export default meta;

type Story = StoryObj<typeof PdDetailView>;

export const Populated: Story = {
  name: "PD と RePD が並ぶ",
  parameters: {
    msw: { handlers: [userDetailsHandler(), pdOk(), repdsOk()] },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() =>
      expect(
        canvas.getByText("現場で気づいたことを共有します"),
      ).toBeInTheDocument(),
    );
    await waitFor(() =>
      expect(canvas.getByText("とても参考になりました")).toBeInTheDocument(),
    );
    expect(
      canvas.getByRole("button", { name: "RePDする" }),
    ).toBeInTheDocument();
  },
};

export const PdFetchFailed: Story = {
  name: "PD 取得失敗で再試行を出す",
  parameters: {
    msw: {
      handlers: [
        userDetailsHandler(),
        http.get("*/pd", () => new HttpResponse(null, { status: 500 })),
        repdsOk(),
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

export const RePdEmpty: Story = {
  name: "RePD が無いとき空状態を出す",
  parameters: {
    msw: {
      handlers: [
        userDetailsHandler(),
        pdOk(),
        http.get("*/repd", () => HttpResponse.json([])),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() =>
      expect(
        canvas.getByText("まだ RePD はありません。RePD してみよう!"),
      ).toBeInTheDocument(),
    );
  },
};

export const NotFound: Story = {
  name: "PD が見つからないとき空状態を出す",
  parameters: {
    msw: {
      handlers: [
        userDetailsHandler(),
        http.get("*/pd", () =>
          HttpResponse.json({ items: [], nextCursor: null }),
        ),
        http.get("*/repd", () => HttpResponse.json([])),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() =>
      expect(
        canvas.getByText("指定された PD が見つかりませんでした"),
      ).toBeInTheDocument(),
    );
  },
};

export const ReplyFromComposer: Story = {
  name: "RePDする から返信を投稿できる",
  parameters: {
    msw: {
      handlers: [
        userDetailsHandler(),
        pdOk(),
        repdsOk(),
        http.post("*/repd/create", () =>
          HttpResponse.json({}, { status: 201 }),
        ),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() =>
      expect(
        canvas.getByText("現場で気づいたことを共有します"),
      ).toBeInTheDocument(),
    );

    await userEvent.click(canvas.getByRole("button", { name: "RePDする" }));

    const dialog = within(within(document.body).getByRole("dialog"));
    const textarea = await dialog.findByRole("textbox");
    await userEvent.type(textarea, "私もそう思いました");
    await userEvent.click(dialog.getByRole("button", { name: "RePDする" }));

    await waitFor(() =>
      expect(
        within(document.body).queryByRole("dialog"),
      ).not.toBeInTheDocument(),
    );
    await waitFor(() =>
      expect(
        within(document.body).getByText("RePD しました"),
      ).toBeInTheDocument(),
    );
  },
};

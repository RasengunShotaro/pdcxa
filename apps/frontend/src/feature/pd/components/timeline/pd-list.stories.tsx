import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Plus } from "lucide-react";
import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Button } from "@/components/ui/button";
import type { Pd } from "@/feature/pd/types";
import { PdList } from "./pd-list";

const aPd = (overrides: { id: string; content: string }): Pd => ({
  id: overrides.id,
  content: overrides.content,
  createdAt: "2026-06-24T00:00:00.000Z",
  userId: "u-taro",
  likeCount: 0,
  replyCount: 0,
  likes: [],
  isMyPd: false,
  isBookmarked: false,
  imageFileName: null,
  quotedPd: null,
  quoteCount: 0,
  userDetail: {
    id: "u-taro",
    userFullName: "太郎 山田",
    imageUrl: "",
    userName: "taro",
    badges: [],
  },
  likeUserNames: [],
  likeUsers: [],
});

const INITIAL_PDS = [
  aPd({ id: "pd-2", content: "昨日のメモ" }),
  aPd({ id: "pd-1", content: "一昨日のメモ" }),
];

const meta: Meta<typeof PdList> = {
  title: "ホーム/PdList",
  component: PdList,
  parameters: { layout: "padded" },
  args: {
    pds: INITIAL_PDS,
    isPending: false,
    isError: false,
    error: null,
    hasNextPage: false,
    isFetchingNextPage: false,
    onLoadMore: () => {},
    onRetry: () => {},
    emptyState: <p>まだPDがありません</p>,
  },
};

export default meta;

type Story = StoryObj<typeof PdList>;

export const PrependPd: Story = {
  name: "投稿を追加すると先頭に新しい PD が現れる",
  decorators: [
    (Story, context) => {
      const [pds, setPds] = useState(INITIAL_PDS);
      const addPd = () =>
        setPds((current) => [
          aPd({
            id: `pd-new-${current.length}`,
            content: "いま投稿したメモ",
          }),
          ...current,
        ]);

      return (
        <div className="flex flex-col gap-4">
          <Button className="self-start" onClick={addPd} type="button">
            <Plus aria-hidden="true" className="size-4" />
            先頭に PD を追加
          </Button>
          <Story args={{ ...context.args, pds }} />
        </div>
      );
    },
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await canvas.findByText("昨日のメモ");

    await userEvent.click(
      canvas.getByRole("button", { name: "先頭に PD を追加" }),
    );

    const [firstRow] = canvas.getAllByRole("listitem");
    expect(firstRow).toHaveTextContent("いま投稿したメモ");
    await waitFor(() => expect(firstRow).toBeVisible());
  },
};

export const InitialRowsStayStill: Story = {
  name: "最初に並んだ PD は動かさずにそのまま表示する",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await canvas.findByText("昨日のメモ");

    const rows = canvas.getAllByRole("listitem");

    expect(rows.map((row) => row.getAttribute("style"))).toEqual([null, null]);
  },
};

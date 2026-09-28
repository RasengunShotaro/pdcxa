import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Plus } from "lucide-react";
import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Button } from "@/components/ui/button";
import type { RePd } from "@/feature/pd/types";
import { RePdSection } from "./repd-section";

const aRePd = (overrides: { id: string; content: string }): RePd => ({
  id: overrides.id,
  pdId: "pd-1",
  content: overrides.content,
  createdAt: "2026-06-24T00:00:00.000Z",
  userId: "u-hanako",
  likeCount: 0,
  likes: [],
  isMyRePd: false,
  userDetail: {
    id: "u-hanako",
    userFullName: "花子 鈴木",
    imageUrl: "",
    userName: "hanako",
    badges: [],
  },
  likeUserNames: [],
  likeUsers: [],
});

const INITIAL_REPDS = [aRePd({ id: "repd-1", content: "最初の RePD" })];

const meta: Meta<typeof RePdSection> = {
  title: "PD詳細/RePdSection",
  component: RePdSection,
  parameters: { layout: "padded" },
  args: {
    rePds: INITIAL_REPDS,
    isPending: false,
    isError: false,
    error: null,
    onRetry: () => {},
  },
};

export default meta;

type Story = StoryObj<typeof RePdSection>;

export const AppendRePd: Story = {
  name: "RePD を送ると一覧の末尾に新しい RePD が現れる",
  decorators: [
    (Story, context) => {
      const [rePds, setRePds] = useState(INITIAL_REPDS);
      const addRePd = () =>
        setRePds((current) => [
          ...current,
          aRePd({
            id: `repd-new-${current.length}`,
            content: "いま送った RePD",
          }),
        ]);

      return (
        <div className="flex flex-col gap-4">
          <Button className="self-start" onClick={addRePd} type="button">
            <Plus aria-hidden="true" className="size-4" />
            末尾に RePD を追加
          </Button>
          <Story args={{ ...context.args, rePds }} />
        </div>
      );
    },
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await canvas.findByText("最初の RePD");

    await userEvent.click(
      canvas.getByRole("button", { name: "末尾に RePD を追加" }),
    );

    const rows = canvas.getAllByRole("listitem");
    const lastRow = rows[rows.length - 1];
    expect(lastRow).toHaveTextContent("いま送った RePD");
    await waitFor(() => expect(lastRow).toBeVisible());
  },
};

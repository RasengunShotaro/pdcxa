import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Button } from "@/components/ui/button";
import { UnreadBadge } from "./unread-badge";

interface UnreadBadgePlaygroundProps {
  initialCount: number;
}

function UnreadBadgePlayground({ initialCount }: UnreadBadgePlaygroundProps) {
  const [count, setCount] = useState(initialCount);
  return (
    <div className="flex items-center gap-3">
      <Button
        onClick={() => setCount((c) => Math.max(c - 1, 0))}
        type="button"
        variant="outline"
      >
        既読にする
      </Button>
      <output
        aria-label="通知"
        className="inline-flex h-6 min-w-24 items-center gap-1.5 text-sm text-body"
      >
        通知
        <UnreadBadge count={count} />
      </output>
      <Button
        onClick={() => setCount((c) => c + 1)}
        type="button"
        variant="outline"
      >
        通知が届く
      </Button>
    </div>
  );
}

const meta: Meta<typeof UnreadBadgePlayground> = {
  title: "共通/UnreadBadge",
  component: UnreadBadgePlayground,
  parameters: { layout: "centered" },
  args: { initialCount: 3 },
};
export default meta;

type Story = StoryObj<typeof UnreadBadgePlayground>;

export const ShowsNewCountWhenIncreased: Story = {
  name: "未読が増えると新しい件数を表示する",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: "通知が届く" }));

    await waitFor(() =>
      expect(canvas.getByRole("status", { name: "通知" })).toHaveTextContent(
        /^通知4件の未読の通知$/,
      ),
    );
  },
};

export const ShowsNewCountWhenDecreased: Story = {
  name: "未読が減ると新しい件数を表示する",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: "既読にする" }));

    await waitFor(() =>
      expect(canvas.getByRole("status", { name: "通知" })).toHaveTextContent(
        /^通知2件の未読の通知$/,
      ),
    );
  },
};

export const AppearsWhenFirstUnreadArrives: Story = {
  name: "未読が無い状態で通知が届くと件数が現れる",
  args: { initialCount: 0 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("status", { name: "通知" }),
    ).toHaveTextContent(/^通知$/);

    await userEvent.click(canvas.getByRole("button", { name: "通知が届く" }));

    await waitFor(() =>
      expect(canvas.getByRole("status", { name: "通知" })).toHaveTextContent(
        /^通知1件の未読の通知$/,
      ),
    );
  },
};

export const DisappearsWhenAllRead: Story = {
  name: "未読をすべて読むと件数が消える",
  args: { initialCount: 1 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: "既読にする" }));

    await waitFor(() =>
      expect(canvas.getByRole("status", { name: "通知" })).toHaveTextContent(
        /^通知$/,
      ),
    );
  },
};

export const CapsAtNinetyNinePlus: Story = {
  name: "未読が 99 件を超えると 99+ と表示する",
  args: { initialCount: 99 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: "通知が届く" }));

    await waitFor(() =>
      expect(canvas.getByRole("status", { name: "通知" })).toHaveTextContent(
        /^通知99\+件の未読の通知$/,
      ),
    );
  },
};

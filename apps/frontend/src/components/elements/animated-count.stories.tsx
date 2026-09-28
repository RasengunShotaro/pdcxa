import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Button } from "@/components/ui/button";
import { AnimatedCount } from "./animated-count";

function CountPlayground() {
  const [count, setCount] = useState(9);
  return (
    <div className="flex items-center gap-3">
      <Button
        onClick={() => setCount((c) => c - 1)}
        type="button"
        variant="outline"
      >
        減らす
      </Button>
      <output aria-label="件数" className="text-2xl text-foreground">
        <AnimatedCount value={count} />
      </output>
      <Button
        onClick={() => setCount((c) => c + 1)}
        type="button"
        variant="outline"
      >
        増やす
      </Button>
    </div>
  );
}

const meta: Meta<typeof CountPlayground> = {
  title: "共通/AnimatedCount",
  component: CountPlayground,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof CountPlayground>;

export const RollsWhenIncreased: Story = {
  name: "件数が増えると新しい件数に切り替わる",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: "増やす" }));

    await waitFor(() =>
      expect(canvas.getByRole("status", { name: "件数" })).toHaveTextContent(
        /^10$/,
      ),
    );
  },
};

export const RollsWhenDecreased: Story = {
  name: "件数が減ると新しい件数に切り替わる",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: "減らす" }));

    await waitFor(() =>
      expect(canvas.getByRole("status", { name: "件数" })).toHaveTextContent(
        /^8$/,
      ),
    );
  },
};

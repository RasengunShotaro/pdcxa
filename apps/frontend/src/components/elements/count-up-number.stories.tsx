import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Button } from "@/components/ui/button";
import { CountUpNumber } from "./count-up-number";

const toJapaneseNumber = (value: number): string =>
  value.toLocaleString("ja-JP");

interface CountUpPlaygroundProps {
  initialValue: number;
}

function CountUpPlayground({ initialValue }: CountUpPlaygroundProps) {
  const [value, setValue] = useState(initialValue);
  return (
    <div className="flex items-center gap-3">
      <output
        aria-label="件数"
        className="text-3xl font-bold tabular-nums text-foreground"
      >
        <CountUpNumber format={toJapaneseNumber} value={value} />
      </output>
      <Button
        onClick={() => setValue((v) => v + 1000)}
        type="button"
        variant="outline"
      >
        増やす
      </Button>
    </div>
  );
}

const meta: Meta<typeof CountUpPlayground> = {
  title: "共通/CountUpNumber",
  component: CountUpPlayground,
  parameters: { layout: "centered" },
  args: { initialValue: 1234 },
};
export default meta;

type Story = StoryObj<typeof CountUpPlayground>;

export const CountsUpToTarget: Story = {
  name: "表示すると0から数え上げて目標の件数で止まる",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(() =>
      expect(canvas.getByRole("status", { name: "件数" })).toHaveTextContent(
        /^1,234$/,
      ),
    );
  },
};

export const ZeroStaysZero: Story = {
  name: "0件は0のまま出す",
  args: { initialValue: 0 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(() =>
      expect(canvas.getByRole("status", { name: "件数" })).toHaveTextContent(
        /^0$/,
      ),
    );
  },
};

export const DoesNotReplayOnUpdate: Story = {
  name: "数え上げた後に件数が変わっても数え直さずに新しい件数を出す",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const count = canvas.getByRole("status", { name: "件数" });
    await waitFor(() => expect(count).toHaveTextContent(/^1,234$/));

    await userEvent.click(canvas.getByRole("button", { name: "増やす" }));

    expect(count).toHaveTextContent(/^2,234$/);
  },
};

export const JumpsWhenChangedMidway: Story = {
  name: "数え上げの途中で件数が変わると0から数え直さず新しい件数をすぐ出す",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: "増やす" }));

    await waitFor(
      () =>
        expect(canvas.getByRole("status", { name: "件数" })).toHaveTextContent(
          /^2,234$/,
        ),
      { timeout: 200 },
    );
  },
};

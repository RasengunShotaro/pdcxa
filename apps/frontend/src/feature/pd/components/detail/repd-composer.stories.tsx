import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { RePdComposer } from "./repd-composer";

interface HarnessProps {
  onSubmitRePd: (content: string) => Promise<void>;
}

function ComposerHarness({ onSubmitRePd }: HarnessProps) {
  const [open, setOpen] = useState(true);
  return (
    <div>
      <button onClick={() => setOpen(true)} type="button">
        RePD を開く
      </button>
      <RePdComposer
        isPending={false}
        onOpenChange={setOpen}
        onSubmitRePd={onSubmitRePd}
        open={open}
      />
    </div>
  );
}

const meta: Meta<typeof RePdComposer> = {
  title: "PD詳細/RePdComposer",
  component: RePdComposer,
  parameters: { layout: "centered" },
};

export default meta;

type Story = StoryObj<typeof RePdComposer>;

const getDialog = () => within(document.body).getByRole("dialog");

export const SubmitSuccess: Story = {
  name: "返信に成功するとダイアログを閉じてリセットする",
  render: () => <ComposerHarness onSubmitRePd={() => Promise.resolve()} />,
  play: async () => {
    const dialog = within(getDialog());
    const textarea = await dialog.findByRole("textbox");

    await userEvent.type(textarea, "とても参考になりました");
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

export const BlankIsDisabled: Story = {
  name: "空白のみでは送信できない",
  render: () => <ComposerHarness onSubmitRePd={() => Promise.resolve()} />,
  play: async () => {
    const dialog = within(getDialog());
    const textarea = await dialog.findByRole("textbox");

    await userEvent.type(textarea, "   ");

    expect(dialog.getByRole("button", { name: "RePDする" })).toBeDisabled();
  },
};

export const OverLimitIsDisabled: Story = {
  name: "200文字超で残数が警告色になり送信できない",
  render: () => <ComposerHarness onSubmitRePd={() => Promise.resolve()} />,
  play: async () => {
    const dialog = within(getDialog());
    const textarea = await dialog.findByRole("textbox");

    await userEvent.click(textarea);
    await userEvent.paste("あ".repeat(201));

    expect(dialog.getByRole("button", { name: "RePDする" })).toBeDisabled();
    await waitFor(() =>
      expect(dialog.getByText("残り -1 / 200")).toBeInTheDocument(),
    );
  },
};

export const SubmitFailureKeepsInput: Story = {
  name: "送信に失敗しても入力を保持し画面内 Alert を出す",
  render: () => (
    <ComposerHarness
      onSubmitRePd={() => Promise.reject(new Error("network down"))}
    />
  ),
  play: async () => {
    const dialog = within(getDialog());
    const textarea = await dialog.findByRole("textbox");

    await userEvent.type(textarea, "送信に失敗するはずの返信");
    await userEvent.click(dialog.getByRole("button", { name: "RePDする" }));

    await waitFor(() =>
      expect(
        dialog.getByText("通信に失敗しました。再試行してください"),
      ).toBeInTheDocument(),
    );
    expect(within(document.body).getByRole("dialog")).toBeInTheDocument();
    expect(
      dialog.getByDisplayValue("送信に失敗するはずの返信"),
    ).toBeInTheDocument();
  },
};

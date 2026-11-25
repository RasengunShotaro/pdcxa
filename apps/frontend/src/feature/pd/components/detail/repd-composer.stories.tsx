import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { RePdComposer } from "./repd-composer";

const meta: Meta<typeof RePdComposer> = {
  title: "PD詳細/RePdComposer",
  component: RePdComposer,
  parameters: { layout: "padded" },
  args: { isPending: false, onSubmitRePd: () => Promise.resolve() },
};

export default meta;

type Story = StoryObj<typeof RePdComposer>;

export const SubmitSuccess: Story = {
  name: "返信に成功すると入力欄を空に戻す",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const textarea = await canvas.findByRole("textbox");

    await userEvent.type(textarea, "とても参考になりました");
    await userEvent.click(canvas.getByRole("button", { name: "RePDする" }));

    await waitFor(() => expect(textarea).toHaveValue(""));
    await waitFor(() =>
      expect(
        within(document.body).getByText("RePDしました"),
      ).toBeInTheDocument(),
    );
  },
};

export const BlankIsDisabled: Story = {
  name: "空白のみでは送信できない",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const textarea = await canvas.findByRole("textbox");

    await userEvent.type(textarea, "   ");

    expect(canvas.getByRole("button", { name: "RePDする" })).toBeDisabled();
  },
};

export const OverLimitIsDisabled: Story = {
  name: "200文字超で残数が警告色になり送信できない",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const textarea = await canvas.findByRole("textbox");

    await userEvent.click(textarea);
    await userEvent.paste("あ".repeat(201));

    expect(canvas.getByRole("button", { name: "RePDする" })).toBeDisabled();
    await waitFor(() =>
      expect(canvas.getByText("残り -1 / 200")).toBeInTheDocument(),
    );
  },
};

export const SubmitFailureKeepsInput: Story = {
  name: "送信に失敗しても入力を保持し画面内 Alert を出す",
  args: { onSubmitRePd: () => Promise.reject(new Error("network down")) },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const textarea = await canvas.findByRole("textbox");

    await userEvent.type(textarea, "送信に失敗するはずの返信");
    await userEvent.click(canvas.getByRole("button", { name: "RePDする" }));

    await waitFor(() =>
      expect(canvas.getByRole("alert")).toHaveTextContent(
        "通信に失敗しました。再試行してください",
      ),
    );
    expect(
      canvas.getByDisplayValue("送信に失敗するはずの返信"),
    ).toBeInTheDocument();
  },
};

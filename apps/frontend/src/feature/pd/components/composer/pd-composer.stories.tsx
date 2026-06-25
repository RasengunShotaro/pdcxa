import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HttpResponse, http } from "msw";
import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { PdComposer } from "./pd-composer";

function ComposerHarness({ initialOpen = true }: { initialOpen?: boolean }) {
  const [open, setOpen] = useState(initialOpen);
  return (
    <div>
      <button onClick={() => setOpen(true)} type="button">
        コンポーザを開く
      </button>
      <PdComposer onOpenChange={setOpen} open={open} />
    </div>
  );
}

const createPdOk = () =>
  http.post("*/pd/create", () => HttpResponse.json({}, { status: 201 }));

const createPdFail = () =>
  http.post("*/pd/create", () => new HttpResponse(null, { status: 500 }));

const meta: Meta<typeof PdComposer> = {
  title: "ホーム/PdComposer",
  component: PdComposer,
  parameters: { layout: "centered" },
};

export default meta;

type Story = StoryObj<typeof PdComposer>;

const getDialog = () => within(document.body).getByRole("dialog");

export const SubmitSuccess: Story = {
  name: "投稿に成功するとダイアログを閉じる",
  parameters: { msw: { handlers: [createPdOk()] } },
  render: () => <ComposerHarness />,
  play: async () => {
    const dialog = within(getDialog());
    const textarea = await dialog.findByRole("textbox");

    await userEvent.type(textarea, "今日気づいたこと");
    await userEvent.click(dialog.getByRole("button", { name: "PDする" }));

    await waitFor(() =>
      expect(
        within(document.body).queryByRole("dialog"),
      ).not.toBeInTheDocument(),
    );
    await waitFor(() =>
      expect(
        within(document.body).getByText("PD しました"),
      ).toBeInTheDocument(),
    );
  },
};

export const BlocksWhitespaceOnly: Story = {
  name: "空白だけのときは送信ボタンを押せない",
  parameters: { msw: { handlers: [createPdOk()] } },
  render: () => <ComposerHarness />,
  play: async () => {
    const dialog = within(getDialog());
    const textarea = await dialog.findByRole("textbox");

    await userEvent.type(textarea, "   ");

    expect(dialog.getByRole("button", { name: "PDする" })).toBeDisabled();
  },
};

export const CounterAndOverLimit: Story = {
  name: "文字数カウンタが更新され上限超過で送信できない",
  parameters: { msw: { handlers: [createPdOk()] } },
  render: () => <ComposerHarness />,
  play: async () => {
    const dialog = within(getDialog());
    const textarea = await dialog.findByRole("textbox");

    await userEvent.type(textarea, "あいうえお");
    expect(dialog.getByText("残り 195 / 200")).toBeInTheDocument();

    await userEvent.clear(textarea);
    await userEvent.click(textarea);
    await userEvent.paste("あ".repeat(201));

    await waitFor(() =>
      expect(dialog.getByText("残り -1 / 200")).toBeInTheDocument(),
    );
    expect(dialog.getByRole("button", { name: "PDする" })).toBeDisabled();
  },
};

export const DraftRetainedAfterClose: Story = {
  name: "閉じても下書きが保持される",
  parameters: { msw: { handlers: [createPdOk()] } },
  render: () => <ComposerHarness />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const dialog = within(getDialog());
    const textarea = await dialog.findByRole("textbox");

    await userEvent.type(textarea, "書きかけの下書き");
    await userEvent.click(dialog.getByRole("button", { name: "Close" }));

    await waitFor(() =>
      expect(
        within(document.body).queryByRole("dialog"),
      ).not.toBeInTheDocument(),
    );

    await userEvent.click(
      canvas.getByRole("button", { name: "コンポーザを開く" }),
    );

    await waitFor(() =>
      expect(
        within(getDialog()).getByDisplayValue("書きかけの下書き"),
      ).toBeInTheDocument(),
    );
  },
};

export const ImageAttachAndRemove: Story = {
  name: "画像を添付するとプレビューが出て削除で消える",
  parameters: { msw: { handlers: [createPdOk()] } },
  render: () => <ComposerHarness />,
  play: async () => {
    const dialog = within(getDialog());
    const fileInput = dialog.getByLabelText("画像ファイルを選択");
    const file = new File(["x"], "photo.png", { type: "image/png" });

    await userEvent.upload(fileInput, file);

    await waitFor(() =>
      expect(
        dialog.getByRole("img", { name: "添付する画像のプレビュー" }),
      ).toBeInTheDocument(),
    );

    await userEvent.click(dialog.getByRole("button", { name: "画像を削除" }));

    await waitFor(() =>
      expect(
        dialog.queryByRole("img", { name: "添付する画像のプレビュー" }),
      ).not.toBeInTheDocument(),
    );
  },
};

export const SubmitFailureKeepsDraft: Story = {
  name: "送信に失敗したら閉じず入力を保持してエラーを出す",
  parameters: { msw: { handlers: [createPdFail()] } },
  render: () => <ComposerHarness />,
  play: async () => {
    const dialog = within(getDialog());
    const textarea = await dialog.findByRole("textbox");

    await userEvent.type(textarea, "送信に失敗するはずの本文");
    await userEvent.click(dialog.getByRole("button", { name: "PDする" }));

    await waitFor(() =>
      expect(
        within(getDialog()).getByText("通信に失敗しました。再試行してください"),
      ).toBeInTheDocument(),
    );
    expect(
      within(getDialog()).getByDisplayValue("送信に失敗するはずの本文"),
    ).toBeInTheDocument();
  },
};

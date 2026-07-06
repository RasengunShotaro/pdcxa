import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { ProfileHandleField } from "./profile-handle-field";

const meta: Meta<typeof ProfileHandleField> = {
  title: "プロフィール/ProfileHandleField",
  component: ProfileHandleField,
  parameters: { layout: "centered" },
  args: {
    defaultValues: { handle: "pdcxa" },
    onSubmit: () => Promise.resolve({ ok: true }),
  },
};

export default meta;

type Story = StoryObj<typeof ProfileHandleField>;

const inlineStatusText = (canvasElement: HTMLElement): string | undefined =>
  canvasElement.querySelector('p[role="status"]')?.textContent ?? undefined;

export const SubmitSuccess: Story = {
  name: "保存に成功すると完了メッセージを画面内に表示する",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: "保存する" }));

    await waitFor(() =>
      expect(inlineStatusText(canvasElement)).toBe("IDを変更しました"),
    );
  },
};

export const WhitespaceShowsFieldError: Story = {
  name: "空白を含む入力は送信前に入力欄の直下で弾く",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("ID");

    await userEvent.clear(input);
    await userEvent.type(input, "pd cxa");
    await userEvent.click(canvas.getByRole("button", { name: "保存する" }));

    await waitFor(() =>
      expect(canvas.getByText("IDに空白は使えません")).toBeInTheDocument(),
    );
  },
};

export const HandleTakenShowsAlert: Story = {
  name: "既に使われているIDだと専用の案内を画面内 Alert に出す",
  args: {
    onSubmit: () => Promise.resolve({ ok: false, reason: "taken" }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: "保存する" }));

    await waitFor(() =>
      expect(
        canvas.getByText(
          "このIDは既に使われています。別のIDを入力してください。",
        ),
      ).toBeInTheDocument(),
    );
  },
};

export const InvalidCharacterShowsAlert: Story = {
  name: "使えない文字を含むと文字種の案内を画面内 Alert に出す",
  args: {
    onSubmit: () => Promise.resolve({ ok: false, reason: "invalidCharacter" }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: "保存する" }));

    await waitFor(() =>
      expect(
        canvas.getByText(
          "IDに使えない文字が含まれています。英数字などで入力してください。",
        ),
      ).toBeInTheDocument(),
    );
  },
};

export const UpdateFailureShowsAlert: Story = {
  name: "保存に失敗すると再試行を促す Alert を出す",
  args: {
    onSubmit: () => Promise.resolve({ ok: false, reason: "unknown" }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: "保存する" }));

    await waitFor(() =>
      expect(
        canvas.getByText(
          "IDの変更に失敗しました。時間をおいて再試行してください。",
        ),
      ).toBeInTheDocument(),
    );
  },
};

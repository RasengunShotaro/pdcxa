import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HttpResponse, http } from "msw";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { InvitationForm } from "./invitation-form";

const createInvitationOk = () =>
  http.post("*/invitation/create", () =>
    HttpResponse.json({}, { status: 200 }),
  );

const createInvitationFail = () =>
  http.post(
    "*/invitation/create",
    () => new HttpResponse(null, { status: 500 }),
  );

const meta: Meta<typeof InvitationForm> = {
  title: "招待/InvitationForm",
  component: InvitationForm,
  parameters: { layout: "centered" },
};

export default meta;

type Story = StoryObj<typeof InvitationForm>;

export const SubmitSuccess: Story = {
  name: "送信に成功すると成功表示が出て入力がクリアされる",
  parameters: { msw: { handlers: [createInvitationOk()] } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("メールアドレス");
    await userEvent.type(input, "invite@example.com");
    await userEvent.click(
      canvas.getByRole("button", { name: "PDCXAの世界に招待" }),
    );

    await waitFor(() =>
      expect(
        canvas.getByText("invite@example.com に招待を送信しました。"),
      ).toBeInTheDocument(),
    );
    expect(input).toHaveValue("");
  },
};

export const InvalidEmail: Story = {
  name: "メール形式が不正だとフィールドエラーを出し送信しない",
  parameters: { msw: { handlers: [createInvitationOk()] } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(
      canvas.getByLabelText("メールアドレス"),
      "not-an-email",
    );
    await userEvent.click(
      canvas.getByRole("button", { name: "PDCXAの世界に招待" }),
    );

    await waitFor(() =>
      expect(
        canvas.getByText("メールアドレスの形式が正しくありません"),
      ).toBeInTheDocument(),
    );
    expect(canvas.queryByText(/に招待を送信しました/)).not.toBeInTheDocument();
  },
};

export const SubmitFailure: Story = {
  name: "送信に失敗すると固定文言のAlertを出し入力を保持する",
  parameters: { msw: { handlers: [createInvitationFail()] } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("メールアドレス");
    await userEvent.type(input, "invite@example.com");
    await userEvent.click(
      canvas.getByRole("button", { name: "PDCXAの世界に招待" }),
    );

    await waitFor(() =>
      expect(canvas.getByRole("alert")).toHaveTextContent(
        "通信に失敗しました。再試行してください",
      ),
    );
    expect(input).toHaveValue("invite@example.com");
  },
};

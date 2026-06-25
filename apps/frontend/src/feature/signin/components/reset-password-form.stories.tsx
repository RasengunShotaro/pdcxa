import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import type { SignInFlow } from "@/lib/auth/types";
import { ResetPasswordForm } from "./reset-password-form";

const baseFlow: SignInFlow = {
  status: "needs_first_factor",
  password: async () => ({ error: null }),
  create: async () => ({ error: null }),
  finalize: async ({ navigate }) => {
    navigate({ decorateUrl: (url) => url });
  },
  resetPasswordEmailCode: {
    sendCode: async () => ({ error: null }),
    verifyCode: async () => ({ error: null }),
    submitPassword: async () => ({ error: null }),
  },
};

const failingFlow: SignInFlow = {
  ...baseFlow,
  create: async () => ({ error: new Error("not found") }),
};

const meta: Meta<typeof ResetPasswordForm> = {
  title: "サインイン/ResetPasswordForm",
  component: ResetPasswordForm,
  parameters: { layout: "centered" },
};

export default meta;

type Story = StoryObj<typeof ResetPasswordForm>;

export const SubmitFailure: Story = {
  name: "送信に失敗するとAlertを出し入力を保持する",
  render: () => <ResetPasswordForm flow={failingFlow} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const email = canvas.getByLabelText("メールアドレス");
    await userEvent.type(email, "user@example.com");
    await userEvent.click(
      canvas.getByRole("button", { name: "再設定メールを送信" }),
    );

    await waitFor(() =>
      expect(canvas.getByRole("alert")).toHaveTextContent("再度お試しください"),
    );
    expect(email).toHaveValue("user@example.com");
  },
};

export const InvalidEmail: Story = {
  name: "メール形式が不正だとフィールドエラーを出し送信しない",
  render: () => <ResetPasswordForm flow={baseFlow} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText("メールアドレス"), "bad");
    await userEvent.click(
      canvas.getByRole("button", { name: "再設定メールを送信" }),
    );

    await waitFor(() =>
      expect(
        canvas.getByText("メールアドレスの形式が正しくありません"),
      ).toBeInTheDocument(),
    );
    expect(canvas.queryByRole("alert")).not.toBeInTheDocument();
  },
};

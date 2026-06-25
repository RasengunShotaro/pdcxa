import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import type { SignInFlow } from "@/lib/auth/types";
import { ResetPasswordOtpForm } from "./reset-password-form-otp";

const okFlow: SignInFlow = {
  status: "complete",
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
  ...okFlow,
  resetPasswordEmailCode: {
    ...okFlow.resetPasswordEmailCode,
    verifyCode: async () => ({ error: new Error("invalid code") }),
  },
};

const fillFields = async (
  canvas: ReturnType<typeof within>,
  { password, confirm }: { password: string; confirm: string },
) => {
  await userEvent.type(canvas.getByLabelText("新しいパスワード"), password);
  await userEvent.type(
    canvas.getByLabelText("新しいパスワード再入力"),
    confirm,
  );
  await userEvent.type(canvas.getByLabelText("確認コード（6桁）"), "123456");
};

const meta: Meta<typeof ResetPasswordOtpForm> = {
  title: "サインイン/ResetPasswordOtpForm",
  component: ResetPasswordOtpForm,
  parameters: { layout: "centered" },
};

export default meta;

type Story = StoryObj<typeof ResetPasswordOtpForm>;

export const PasswordMismatch: Story = {
  name: "パスワードと再入力が一致しないとフィールドエラーを出す",
  render: () => <ResetPasswordOtpForm flow={okFlow} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await fillFields(canvas, { password: "password1", confirm: "different1" });
    await userEvent.click(
      canvas.getByRole("button", { name: "パスワードをリセット" }),
    );

    await waitFor(() =>
      expect(canvas.getByText("パスワードが一致しません")).toBeInTheDocument(),
    );
    expect(canvas.queryByRole("alert")).not.toBeInTheDocument();
  },
};

export const VerifyFailure: Story = {
  name: "確認コードの検証に失敗するとAlertを出す",
  render: () => <ResetPasswordOtpForm flow={failingFlow} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await fillFields(canvas, { password: "password1", confirm: "password1" });
    await userEvent.click(
      canvas.getByRole("button", { name: "パスワードをリセット" }),
    );

    await waitFor(() =>
      expect(canvas.getByRole("alert")).toHaveTextContent("再度お試しください"),
    );
  },
};

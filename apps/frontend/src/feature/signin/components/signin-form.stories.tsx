import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import type { SignInFlow } from "@/lib/auth/types";
import { SignInForm } from "./signin-form";

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
  password: async () => ({ error: new Error("invalid credentials") }),
};

const meta: Meta<typeof SignInForm> = {
  title: "サインイン/SignInForm",
  component: SignInForm,
  parameters: { layout: "centered" },
};

export default meta;

type Story = StoryObj<typeof SignInForm>;

export const SubmitSuccess: Story = {
  name: "正しい資格情報でログインに成功する",
  render: () => <SignInForm flow={okFlow} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(
      canvas.getByLabelText("メールアドレス"),
      "user@example.com",
    );
    await userEvent.type(canvas.getByLabelText("パスワード"), "password1");
    await userEvent.click(canvas.getByRole("button", { name: "ログイン" }));

    await waitFor(() =>
      expect(
        within(document.body).getByText("ログインしました!"),
      ).toBeInTheDocument(),
    );
  },
};

export const SubmitFailure: Story = {
  name: "資格情報が誤っているとAlertを出し入力を保持する",
  render: () => <SignInForm flow={failingFlow} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const email = canvas.getByLabelText("メールアドレス");
    await userEvent.type(email, "user@example.com");
    await userEvent.type(canvas.getByLabelText("パスワード"), "password1");
    await userEvent.click(canvas.getByRole("button", { name: "ログイン" }));

    await waitFor(() =>
      expect(canvas.getByRole("alert")).toHaveTextContent(
        "メールアドレスまたはパスワードが正しいか確認してください",
      ),
    );
    expect(email).toHaveValue("user@example.com");
  },
};

export const InvalidEmail: Story = {
  name: "メール形式が不正だとフィールドエラーを出し送信しない",
  render: () => <SignInForm flow={failingFlow} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(
      canvas.getByLabelText("メールアドレス"),
      "not-an-email",
    );
    await userEvent.type(canvas.getByLabelText("パスワード"), "password1");
    await userEvent.click(canvas.getByRole("button", { name: "ログイン" }));

    await waitFor(() =>
      expect(
        canvas.getByText("メールアドレスの形式が正しくありません"),
      ).toBeInTheDocument(),
    );
    expect(canvas.queryByRole("alert")).not.toBeInTheDocument();
  },
};

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HttpResponse, http } from "msw";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { InvitationView } from "./invitation-view";

const meta: Meta<typeof InvitationView> = {
  title: "招待/InvitationView",
  component: InvitationView,
  parameters: {
    layout: "centered",
    msw: {
      handlers: [
        http.post("*/invitation/create", () =>
          HttpResponse.json({}, { status: 200 }),
        ),
      ],
    },
  },
};

export default meta;

type Story = StoryObj<typeof InvitationView>;

export const Default: Story = {
  name: "招待制の文脈とフォームを表示する",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("PDCXA に招待する")).toBeInTheDocument();
    expect(canvas.getByText(/迷惑メールに振り分けられる/)).toBeInTheDocument();
  },
};

export const SendShowsFeedback: Story = {
  name: "送信すると送信先のフィードバックが出る",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(
      canvas.getByLabelText("メールアドレス"),
      "friend@example.com",
    );
    await userEvent.click(
      canvas.getByRole("button", { name: "PDCXAの世界に招待" }),
    );

    await waitFor(() =>
      expect(
        canvas.getByText("friend@example.com に招待を送信しました。"),
      ).toBeInTheDocument(),
    );
  },
};

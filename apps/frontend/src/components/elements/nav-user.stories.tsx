import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { AppSheetsProvider } from "./app-sheets";
import { NavUser } from "./nav-user";

const meta: Meta<typeof NavUser> = {
  title: "共通/NavUser",
  component: NavUser,
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <AppSheetsProvider>
        <div className="w-60 pt-40">
          <Story />
        </div>
      </AppSheetsProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof NavUser>;

export const OpensMenu: Story = {
  name: "ユーザーカードからプロフィールとログアウトを開ける",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: /Dev User/ }));

    const menu = within(document.body);
    await waitFor(() =>
      expect(
        menu.getByRole("menuitem", { name: "プロフィール設定" }),
      ).toBeInTheDocument(),
    );
    await expect(
      menu.getByRole("menuitem", { name: "ログアウト" }),
    ).toBeInTheDocument();
  },
};

export const OpensSettings: Story = {
  name: "ユーザーカードのメニューから設定を開ける",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);

    await userEvent.click(canvas.getByRole("button", { name: /Dev User/ }));
    await userEvent.click(await body.findByRole("menuitem", { name: "設定" }));

    await waitFor(() =>
      expect(body.getByRole("dialog", { name: "設定" })).toBeInTheDocument(),
    );
  },
};

export const OpensProfile: Story = {
  name: "ユーザーカードのメニューから、画面を移らずにプロフィール設定のシートを開ける",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);

    await userEvent.click(canvas.getByRole("button", { name: /Dev User/ }));
    await userEvent.click(
      await body.findByRole("menuitem", { name: "プロフィール設定" }),
    );

    await waitFor(() =>
      expect(
        body.getByRole("dialog", { name: "プロフィール設定" }),
      ).toBeInTheDocument(),
    );
  },
};

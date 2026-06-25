import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { SidebarProvider } from "@/components/ui/sidebar";
import { NavUser } from "./nav-user";

const meta: Meta<typeof NavUser> = {
  title: "共通/NavUser",
  component: NavUser,
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <SidebarProvider>
        <Story />
      </SidebarProvider>
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
      menu.getByRole("menuitem", { name: "プロフィール設定" }),
    ).toHaveAttribute("href", "/profile");
    await expect(
      menu.getByRole("menuitem", { name: "ログアウト" }),
    ).toBeInTheDocument();
  },
};

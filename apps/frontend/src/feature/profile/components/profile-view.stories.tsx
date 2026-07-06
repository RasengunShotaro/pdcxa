import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { ProfileView } from "./profile-view";

const meta: Meta<typeof ProfileView> = {
  title: "プロフィール/ProfileView",
  component: ProfileView,
  parameters: { layout: "fullscreen" },
};

export default meta;

type Story = StoryObj<typeof ProfileView>;

export const Populated: Story = {
  name: "現在の表示名と画像変更ボタンを表示する",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("プロフィール設定")).toBeInTheDocument();
    await expect(
      canvas.getByRole("heading", { name: "プロフィール画像" }),
    ).toBeInTheDocument();
    await expect(canvas.getByLabelText("First Name")).toHaveValue("Dev");
    await expect(
      canvas.getByRole("button", { name: "画像を変更する" }),
    ).toBeVisible();
  },
};

export const NameValidationError: Story = {
  name: "First Name が空のまま保存するとエラーを表示する",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nameSection = within(canvas.getByRole("region", { name: "表示名" }));

    await userEvent.clear(canvas.getByLabelText("First Name"));
    await userEvent.click(
      nameSection.getByRole("button", { name: "保存する" }),
    );

    await waitFor(() =>
      expect(
        canvas.getByText("First Name を入力してください"),
      ).toBeInTheDocument(),
    );
  },
};

export const NameSubmitSuccess: Story = {
  name: "表示名の保存に成功すると完了メッセージを表示する",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nameSection = within(canvas.getByRole("region", { name: "表示名" }));

    await userEvent.click(
      nameSection.getByRole("button", { name: "保存する" }),
    );

    await waitFor(() =>
      expect(nameSection.getByText("表示名を変更しました")).toBeInTheDocument(),
    );
  },
};

export const HandleSubmitSuccess: Story = {
  name: "ID の保存に成功すると完了メッセージを表示する",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const handleSection = within(canvas.getByRole("region", { name: "ID" }));

    await userEvent.click(
      handleSection.getByRole("button", { name: "保存する" }),
    );

    await waitFor(() =>
      expect(handleSection.getByText("IDを変更しました")).toBeInTheDocument(),
    );
  },
};

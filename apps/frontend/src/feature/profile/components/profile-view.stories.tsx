import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { ProfileView } from "./profile-view";

const meta: Meta<typeof ProfileView> = {
  title: "プロフィール/ProfileView",
  component: ProfileView,
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-2xl p-4">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: "fullscreen" },
};

export default meta;

type Story = StoryObj<typeof ProfileView>;

export const Populated: Story = {
  name: "現在の表示名と画像変更ボタンを表示する",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(
      canvas.getByRole("heading", { name: "プロフィール画像" }),
    ).toBeInTheDocument();
    await expect(canvas.getByLabelText("表示名（前）")).toHaveValue("Dev");
    await expect(
      canvas.getByRole("button", { name: "画像を変更する" }),
    ).toBeVisible();
  },
};

export const SaveDisabledUntilChanged: Story = {
  name: "変更前は保存できない理由を添えて保存ボタンを押せなくする",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nameSection = within(canvas.getByRole("region", { name: "表示名" }));
    const handleSection = within(canvas.getByRole("region", { name: "ID" }));

    await expect(
      nameSection.getByRole("button", { name: "保存する" }),
    ).toHaveAccessibleDescription("表示名を変更すると保存できます");
    await expect(
      handleSection.getByRole("button", { name: "保存する" }),
    ).toHaveAccessibleDescription("IDを変更すると保存できます");
  },
};

export const NameValidationError: Story = {
  name: "表示名（前）を空にして保存するとエラーを表示する",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nameSection = within(canvas.getByRole("region", { name: "表示名" }));

    await userEvent.clear(canvas.getByLabelText("表示名（前）"));
    await userEvent.click(
      nameSection.getByRole("button", { name: "保存する" }),
    );

    await waitFor(() =>
      expect(
        canvas.getByText("表示名（前）を入力してください"),
      ).toBeInTheDocument(),
    );
  },
};

export const NameSubmitSuccess: Story = {
  name: "表示名の保存に成功すると完了メッセージを表示する",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nameSection = within(canvas.getByRole("region", { name: "表示名" }));

    await userEvent.type(canvas.getByLabelText("表示名（前）"), "x");
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

    await userEvent.type(handleSection.getByLabelText("ID"), "x");
    await userEvent.click(
      handleSection.getByRole("button", { name: "保存する" }),
    );

    await waitFor(() =>
      expect(handleSection.getByText("IDを変更しました")).toBeInTheDocument(),
    );
  },
};

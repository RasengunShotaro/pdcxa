import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { ProfileNameField } from "./profile-name-field";

const meta: Meta<typeof ProfileNameField> = {
  title: "プロフィール/ProfileNameField",
  component: ProfileNameField,
  parameters: { layout: "centered" },
  args: {
    defaultValues: { firstName: "Dev", lastName: "User" },
    onSubmit: () => Promise.resolve(),
  },
};

export default meta;

type Story = StoryObj<typeof ProfileNameField>;

const inlineStatusText = (canvasElement: HTMLElement): string | undefined =>
  canvasElement.querySelector('p[role="status"]')?.textContent ?? undefined;

export const SubmitSuccess: Story = {
  name: "保存に成功すると完了メッセージを画面内に表示する",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: "保存する" }));

    await waitFor(() =>
      expect(inlineStatusText(canvasElement)).toBe("表示名を変更しました"),
    );
  },
};

export const SubmitFailureKeepsAlert: Story = {
  name: "保存に失敗すると画面内 Alert を出す",
  args: {
    onSubmit: () => Promise.reject(new Error("network down")),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: "保存する" }));

    await waitFor(() =>
      expect(
        canvas.getByText(
          "表示名の変更に失敗しました。時間をおいて再試行してください。",
        ),
      ).toBeInTheDocument(),
    );
  },
};

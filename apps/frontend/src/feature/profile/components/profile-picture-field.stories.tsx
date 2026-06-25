import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { ProfilePictureField } from "./profile-picture-field";

const meta: Meta<typeof ProfilePictureField> = {
  title: "プロフィール/ProfilePictureField",
  component: ProfilePictureField,
  parameters: { layout: "centered" },
  args: {
    imageUrl: "",
    displayName: "Dev User",
    onUpload: () => Promise.resolve(),
  },
};

export default meta;

type Story = StoryObj<typeof ProfilePictureField>;

const getFileInput = (canvasElement: HTMLElement): HTMLInputElement => {
  const input =
    canvasElement.querySelector<HTMLInputElement>('input[type="file"]');
  if (!input) {
    throw new Error("ファイル入力が見つかりません");
  }
  return input;
};

const inlineStatusText = (canvasElement: HTMLElement): string | undefined =>
  canvasElement.querySelector('p[role="status"]')?.textContent ?? undefined;

export const SelectSuccess: Story = {
  name: "画像を選ぶと変更完了を画面内に表示する",
  play: async ({ canvasElement }) => {
    const file = new File([new Uint8Array(1024)], "avatar.png", {
      type: "image/png",
    });

    await userEvent.upload(getFileInput(canvasElement), file);

    await waitFor(() =>
      expect(inlineStatusText(canvasElement)).toBe("画像を変更しました"),
    );
  },
};

export const OversizeRejected: Story = {
  name: "10MBを超える画像は選んだ時点で拒否しエラーを表示する",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const tooBig = new File([new Uint8Array(10 * 1024 * 1024 + 1)], "big.png", {
      type: "image/png",
    });

    await userEvent.upload(getFileInput(canvasElement), tooBig);

    await waitFor(() =>
      expect(
        canvas.getByText("ファイルサイズは10MB以下にしてください"),
      ).toBeInTheDocument(),
    );
  },
};

export const UploadFailureKeepsError: Story = {
  name: "アップロードに失敗すると画面内 Alert を出す",
  args: {
    onUpload: () => Promise.reject(new Error("network down")),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const file = new File([new Uint8Array(1024)], "avatar.png", {
      type: "image/png",
    });

    await userEvent.upload(getFileInput(canvasElement), file);

    await waitFor(() =>
      expect(
        canvas.getByText(
          "画像のアップロードに失敗しました。時間をおいて再試行してください。",
        ),
      ).toBeInTheDocument(),
    );
  },
};

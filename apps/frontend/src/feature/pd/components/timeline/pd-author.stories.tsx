import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { PdAuthor } from "./pd-author";

const meta: Meta<typeof PdAuthor> = {
  title: "ホーム/PdAuthor",
  component: PdAuthor,
  parameters: { layout: "padded" },
  args: {
    userFullName: "山田 太郎",
    userName: "taro",
    imageUrl: "",
    createdAt: "2026-06-24T00:00:00.000Z",
  },
};

export default meta;

type Story = StoryObj<typeof PdAuthor>;

export const ハンドルあり: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText("@taro")).toBeInTheDocument();
    const link = canvas.getByRole("link");
    expect(link).toHaveAttribute("href", "/user/taro");
  },
};

export const ハンドル無し: Story = {
  args: { userName: "" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText("山田 太郎")).toBeInTheDocument();
    expect(canvas.queryByText("@")).not.toBeInTheDocument();
    expect(canvas.queryByRole("link")).not.toBeInTheDocument();
  },
};

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { PdAuthorLine, PdAvatar } from "./pd-author";

interface PdAuthorPreviewProps {
  userFullName: string;
  userName: string;
  imageUrl: string;
  createdAt: string;
}

function PdAuthorPreview(props: PdAuthorPreviewProps) {
  return (
    <div className="flex gap-3">
      <PdAvatar {...props} />
      <PdAuthorLine {...props} />
    </div>
  );
}

const meta: Meta<typeof PdAuthorPreview> = {
  title: "ホーム/PdAuthor",
  component: PdAuthorPreview,
  parameters: { layout: "padded" },
  args: {
    userFullName: "山田 太郎",
    userName: "taro",
    imageUrl: "",
    createdAt: "2026-06-24T00:00:00.000Z",
  },
};

export default meta;

type Story = StoryObj<typeof PdAuthorPreview>;

export const ハンドルあり: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText("@taro")).toBeInTheDocument();
    expect(
      canvas.getByRole("link", { name: "山田 太郎さんのページ" }),
    ).toHaveAttribute("href", "/user/taro");
    expect(canvas.getByRole("link", { name: "山田 太郎" })).toHaveAttribute(
      "href",
      "/user/taro",
    );
  },
};

export const ハンドル無し: Story = {
  args: { userName: "" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText("山田 太郎")).toBeInTheDocument();
    expect(canvas.queryByText(/^@/)).not.toBeInTheDocument();
    expect(canvas.queryByRole("link")).not.toBeInTheDocument();
  },
};

export const 名前が空: Story = {
  name: "名前が空ならハンドルを名前として一度だけ出す",
  args: { userFullName: "" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getAllByText("@taro")).toHaveLength(1);
  },
};

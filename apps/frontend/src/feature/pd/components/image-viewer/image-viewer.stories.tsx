import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { ImageViewer } from "./image-viewer";

const 横長の画像 = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000"><rect width="1600" height="1000" fill="#dde8ff"/><circle cx="800" cy="500" r="300" fill="#2b70ef"/></svg>',
)}`;

const meta: Meta<typeof ImageViewer> = {
  title: "ホーム/ImageViewer",
  component: ImageViewer,
  parameters: { layout: "padded" },
  args: { src: 横長の画像, alt: "投稿画像" },
  decorators: [
    (Story) => (
      <div className="flex h-[480px] w-[640px] flex-col">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof ImageViewer>;

const 枠を取り出す = (canvasElement: HTMLElement): HTMLElement => {
  const frame = within(canvasElement).getByTestId("image-viewer-frame");
  return frame;
};

const 画像の表示を待つ = async (canvasElement: HTMLElement) => {
  const image = within(canvasElement).getByAltText("投稿画像");
  await waitFor(() => expect(image.style.width).not.toBe(""));
  return image;
};

export const 開いた直後は全体が枠に収まる: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const frame = 枠を取り出す(canvasElement);

    await 画像の表示を待つ(canvasElement);

    await expect(canvas.getByLabelText("表示倍率")).toHaveTextContent("100%");
    await expect(canvas.getByRole("button", { name: "縮小" })).toBeDisabled();
    await expect(frame.scrollWidth).toBeLessThanOrEqual(frame.clientWidth);
  },
};

export const 拡大ボタンで拡大すると枠からはみ出して送れる: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const frame = 枠を取り出す(canvasElement);
    await 画像の表示を待つ(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: "拡大" }));

    await expect(canvas.getByLabelText("表示倍率")).toHaveTextContent("150%");
    await expect(frame.scrollWidth).toBeGreaterThan(frame.clientWidth);
  },
};

export const 拡大ボタンで拡大しても見ていた中央が中央に残る: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const frame = 枠を取り出す(canvasElement);
    await 画像の表示を待つ(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: "拡大" }));

    await waitFor(() =>
      expect(
        Math.abs(
          frame.scrollLeft - (frame.scrollWidth - frame.clientWidth) / 2,
        ),
      ).toBeLessThanOrEqual(1),
    );
  },
};

export const Ctrlを押しながらホイールを回すと指した点が同じ場所に残る: Story = {
  play: async ({ canvasElement }) => {
    const frame = 枠を取り出す(canvasElement);
    const image = await 画像の表示を待つ(canvasElement);
    const 枠の位置 = frame.getBoundingClientRect();
    const 指した位置 = {
      clientX: 枠の位置.left + 60,
      clientY: 枠の位置.top + 80,
    };
    const 前の画像の位置 = image.getBoundingClientRect();
    const 前の画像上の割合 =
      (指した位置.clientX - 前の画像の位置.left) / 前の画像の位置.width;

    frame.dispatchEvent(
      new WheelEvent("wheel", {
        bubbles: true,
        cancelable: true,
        ctrlKey: true,
        deltaY: -400,
        ...指した位置,
      }),
    );

    await waitFor(() => {
      const 次の画像の位置 = image.getBoundingClientRect();
      expect(次の画像の位置.width).toBeGreaterThan(前の画像の位置.width);
      expect(
        Math.abs(
          (指した位置.clientX - 次の画像の位置.left) / 次の画像の位置.width -
            前の画像上の割合,
        ),
      ).toBeLessThan(0.01);
    });
  },
};

export const 全体を表示で拡大前の大きさに戻る: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await 画像の表示を待つ(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "拡大" }));
    await userEvent.click(canvas.getByRole("button", { name: "拡大" }));

    await userEvent.click(canvas.getByRole("button", { name: "全体を表示" }));

    await expect(canvas.getByLabelText("表示倍率")).toHaveTextContent("100%");
  },
};

export const Ctrlを押しながらホイールを奥へ回すと拡大する: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const frame = 枠を取り出す(canvasElement);
    await 画像の表示を待つ(canvasElement);

    frame.dispatchEvent(
      new WheelEvent("wheel", {
        bubbles: true,
        cancelable: true,
        ctrlKey: true,
        deltaY: -200,
        clientX: 320,
        clientY: 240,
      }),
    );

    await waitFor(() =>
      expect(canvas.getByLabelText("表示倍率")).not.toHaveTextContent("100%"),
    );
  },
};

export const 拡大中はドラッグで見える範囲を動かせる: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const frame = 枠を取り出す(canvasElement);
    await 画像の表示を待つ(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "拡大" }));
    await userEvent.click(canvas.getByRole("button", { name: "拡大" }));
    const 動かす前の送り位置 = frame.scrollLeft;

    frame.dispatchEvent(
      new PointerEvent("pointerdown", {
        bubbles: true,
        cancelable: true,
        pointerType: "mouse",
        button: 0,
        buttons: 1,
        clientX: 300,
        clientY: 200,
      }),
    );
    window.dispatchEvent(
      new PointerEvent("pointermove", {
        bubbles: true,
        cancelable: true,
        pointerType: "mouse",
        buttons: 1,
        clientX: 200,
        clientY: 200,
      }),
    );
    window.dispatchEvent(
      new PointerEvent("pointerup", { bubbles: true, pointerType: "mouse" }),
    );

    await expect(frame.scrollLeft).toBe(動かす前の送り位置 + 100);
  },
};

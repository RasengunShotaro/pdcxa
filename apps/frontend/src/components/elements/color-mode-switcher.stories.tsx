import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ThemeProvider } from "next-themes";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { ColorModeSwitcher } from "./color-mode-switcher";

const meta: Meta<typeof ColorModeSwitcher> = {
  title: "共通/ColorModeSwitcher",
  component: ColorModeSwitcher,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof ColorModeSwitcher>;

export const ShowsCurrentTheme: Story = {
  name: "メニューを開くと現在のテーマに選択の印が付いている",
  decorators: [
    (Story) => (
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        storageKey="storybook-color-mode-current"
        themes={["light", "dark", "legacy"]}
      >
        <Story />
      </ThemeProvider>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);

    await userEvent.click(
      canvas.getByRole("button", { name: "テーマを切り替える" }),
    );

    await waitFor(() =>
      expect(body.getByRole("menuitemradio", { name: "ライト" })).toBeChecked(),
    );
  },
};

export const SelectingThemeMovesCheck: Story = {
  name: "テーマを選ぶと次に開いたとき選んだテーマに選択の印が移る",
  decorators: [
    (Story) => (
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        storageKey="storybook-color-mode-select"
        themes={["light", "dark", "legacy"]}
      >
        <Story />
      </ThemeProvider>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole("button", { name: "テーマを切り替える" });

    await userEvent.click(trigger);
    await userEvent.click(
      await body.findByRole("menuitemradio", { name: "システム" }),
    );
    await userEvent.click(trigger);

    await waitFor(() =>
      expect(
        body.getByRole("menuitemradio", { name: "システム" }),
      ).toBeChecked(),
    );
  },
};

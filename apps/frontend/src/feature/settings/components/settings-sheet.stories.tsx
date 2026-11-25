import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ThemeProvider } from "next-themes";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { SettingsSheet } from "./settings-sheet";

const meta: Meta<typeof SettingsSheet> = {
  title: "設定/SettingsSheet",
  component: SettingsSheet,
  args: { open: true, onOpenChange: () => {}, onOpenProfile: () => {} },
  decorators: [
    (Story) => (
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        storageKey="storybook-settings-theme"
      >
        <Story />
      </ThemeProvider>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof SettingsSheet>;

export const ReduceTransparency: Story = {
  name: "透明度を下げるをオンにすると、ガラスが不透明な面に変わる",
  play: async () => {
    const body = within(document.body);
    window.localStorage.removeItem("pdcxa:appearance");

    await userEvent.click(
      await body.findByRole("switch", { name: "透明度を下げる" }),
    );

    await waitFor(() =>
      expect(
        document.documentElement.classList.contains("reduce-transparency"),
      ).toBe(true),
    );
    await userEvent.click(body.getByRole("switch", { name: "透明度を下げる" }));
  },
};

export const SwitchShowsState: Story = {
  name: "視差効果を減らすをオンにすると、スイッチがオンの状態になる",
  play: async () => {
    const body = within(document.body);
    window.localStorage.removeItem("pdcxa:appearance");
    const toggle = await body.findByRole("switch", {
      name: "視差効果を減らす",
    });

    await userEvent.click(toggle);

    await waitFor(() => expect(toggle).toHaveAttribute("aria-checked", "true"));
    await userEvent.click(toggle);
  },
};

export const SelectsTheme: Story = {
  name: "ダークを選ぶと、テーマがダークに切り替わる",
  play: async () => {
    const body = within(document.body);

    await userEvent.click(await body.findByRole("radio", { name: "ダーク" }));

    await waitFor(() =>
      expect(body.getByRole("radio", { name: "ダーク" })).toBeChecked(),
    );
    await userEvent.click(body.getByRole("radio", { name: "ライト" }));
  },
};

export const SelectsBackdrop: Story = {
  name: "背景に無地を選ぶと、選んだ背景が無地に切り替わる",
  play: async () => {
    const body = within(document.body);
    window.localStorage.removeItem("pdcxa:appearance");

    await userEvent.click(await body.findByRole("radio", { name: "無地" }));

    await waitFor(() =>
      expect(body.getByRole("radio", { name: "無地" })).toBeChecked(),
    );
    await userEvent.click(body.getByRole("radio", { name: "空" }));
  },
};

export const BackdropDefault: Story = {
  name: "背景を選ぶ前は、空の背景が選ばれている",
  play: async () => {
    const body = within(document.body);
    window.localStorage.removeItem("pdcxa:appearance");

    await waitFor(() =>
      expect(body.getByRole("radio", { name: "空" })).toBeChecked(),
    );
  },
};

export const SelectsSkyBackdrop: Story = {
  name: "無地から空を選び直すと、選んだ背景が空に切り替わる",
  play: async () => {
    const body = within(document.body);
    window.localStorage.setItem("pdcxa:appearance", '{"backdrop":"plain"}');
    window.dispatchEvent(new Event("pdcxa:appearance-change"));

    await userEvent.click(await body.findByRole("radio", { name: "空" }));

    await waitFor(() =>
      expect(body.getByRole("radio", { name: "空" })).toBeChecked(),
    );
  },
};

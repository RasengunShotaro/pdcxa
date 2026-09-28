import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Bookmark, Heart } from "lucide-react";
import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatedCount } from "./animated-count";
import { PopOnActivate } from "./pop-on-activate";

function ReactionPlayground() {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const likeCount = liked ? 13 : 12;
  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <Button
        aria-label="いいね"
        aria-pressed={liked}
        className="h-8 w-auto rounded-full pr-1.5 pl-2.5 hover:bg-transparent dark:hover:bg-transparent"
        onClick={() => setLiked((v) => !v)}
        size="icon"
        type="button"
        variant="ghost"
      >
        <PopOnActivate active={liked} ripple>
          <Heart
            aria-hidden="true"
            className={cn(
              "size-4.5 transition-[color,fill] duration-150",
              liked && "fill-primary text-primary",
            )}
          />
        </PopOnActivate>
      </Button>
      <output aria-label="いいねの件数" className="text-xs">
        <AnimatedCount value={likeCount} />
      </output>
      <Button
        aria-label="保存"
        aria-pressed={saved}
        className="size-8 rounded-full"
        onClick={() => setSaved((v) => !v)}
        size="icon"
        type="button"
        variant="ghost"
      >
        <PopOnActivate active={saved}>
          <Bookmark
            aria-hidden="true"
            className={cn(
              "size-4.5 transition-[color,fill] duration-150",
              saved && "fill-primary-600 text-primary-600",
            )}
          />
        </PopOnActivate>
      </Button>
    </div>
  );
}

const meta: Meta<typeof ReactionPlayground> = {
  title: "共通/PopOnActivate",
  component: ReactionPlayground,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof ReactionPlayground>;

export const LikeTurnsOn: Story = {
  name: "いいねを押すとオンになり件数が1つ増える",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: "いいね" }));

    await waitFor(() =>
      expect(
        canvas.getByRole("status", { name: "いいねの件数" }),
      ).toHaveTextContent(/^13$/),
    );
  },
};

export const SaveTurnsOffAgain: Story = {
  name: "保存を2回押すと保存していない状態に戻る",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const save = canvas.getByRole("button", { name: "保存" });

    await userEvent.click(save);
    await userEvent.click(save);

    await expect(save).toHaveAttribute("aria-pressed", "false");
  },
};

"use client";

import {
  CircleCheck,
  CircleX,
  Info,
  LoaderCircle,
  TriangleAlert,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./button";
import { トーストのテーマを決める } from "./sonner-theme";

const VISIBLE_TOASTS = 5;
const TOAST_GAP_PX = 12;
const OFFSET_BELOW_TOP_BAR = { top: 88 };
const MOBILE_OFFSET = { top: 8 };

const ICON_CLASS = "size-6 shrink-0 fill-toast-hue stroke-toast-surface";

const Toaster = ({ ...props }: ToasterProps) => {
  const { forcedTheme, resolvedTheme } = useTheme();

  return (
    <Sonner
      className="toaster group"
      closeButton
      expand
      gap={TOAST_GAP_PX}
      icons={{
        success: <CircleCheck className={ICON_CLASS} />,
        error: <CircleX className={ICON_CLASS} />,
        warning: <TriangleAlert className={ICON_CLASS} />,
        info: <Info className={ICON_CLASS} />,
        loading: <LoaderCircle className="size-6 shrink-0 animate-spin" />,
      }}
      mobileOffset={MOBILE_OFFSET}
      offset={OFFSET_BELOW_TOP_BAR}
      position="top-center"
      theme={トーストのテーマを決める({ forcedTheme, resolvedTheme })}
      toastOptions={{
        unstyled: true,
        closeButtonAriaLabel: "閉じる",
        classNames: {
          toast:
            "app-toast grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-3 gap-y-3 rounded-lg border p-4 text-[1.0625rem] leading-[1.5] whitespace-pre-wrap shadow-sm",
          icon: "col-start-1 row-start-1",
          content: "col-start-2 row-start-1 flex min-w-0 flex-col gap-0.5",
          title: "font-bold",
          description: "text-[0.8125rem] opacity-90",
          closeButton:
            "col-start-3 row-start-1 cursor-pointer border-transparent! bg-transparent! text-current! opacity-70 transition-opacity hover:opacity-100 [&_svg]:size-4",
          actionButton: cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "col-start-2 row-start-2 justify-self-start",
          ),
          cancelButton: cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "col-start-2 row-start-3 justify-self-start",
          ),
        },
      }}
      visibleToasts={VISIBLE_TOASTS}
      {...props}
    />
  );
};

export { Toaster };

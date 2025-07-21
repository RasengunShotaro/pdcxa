"use client";

import {
  AlertTriangle,
  CheckCircle,
  Info,
  Loader2,
  XCircle,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      className="toaster group"
      icons={{
        success: <CheckCircle className="h-5 w-5 text-green-500" />,
        info: <Info className="h-5 w-5 text-blue-500" />,
        warning: <AlertTriangle className="h-5 w-5 text-amber-500" />,
        error: <XCircle className="h-5 w-5 text-red-500" />,
        loading: (
          <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      theme={theme as ToasterProps["theme"]}
      toastOptions={{
        classNames: {
          default: "!text-xl justify-center !w-fit whitespace-pre-wrap",
          description: "!text-sm !text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };

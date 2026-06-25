import type { Preview } from "@storybook/nextjs-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { initialize, mswLoader } from "msw-storybook-addon";
import { useState } from "react";
import { Toaster } from "../src/components/ui/sonner";
import "../src/app/globals.css";

initialize({ onUnhandledRequest: "bypass" });

const preview: Preview = {
  loaders: [mswLoader],
  decorators: [
    (Story) => {
      const [queryClient] = useState(
        () =>
          new QueryClient({
            defaultOptions: {
              queries: { retry: false },
              mutations: { retry: false },
            },
          }),
      );
      return (
        <QueryClientProvider client={queryClient}>
          <Story />
          <Toaster position="top-center" />
        </QueryClientProvider>
      );
    },
  ],
  parameters: {
    options: {
      storySort: {
        order: [
          "ホーム",
          "PD詳細",
          "通知",
          "統計",
          "招待",
          "プロフィール",
          "サインイン",
          "共通",
        ],
      },
    },
    nextjs: {
      appDirectory: true,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: "todo",
    },
  },
};

export default preview;

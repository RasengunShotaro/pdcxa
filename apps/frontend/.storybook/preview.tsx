import type { Preview } from "@storybook/nextjs-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { setupWorker } from "msw/browser";
import { mswLoader } from "msw-storybook-addon/csf3";
import { useState } from "react";
import { Toaster } from "../src/components/ui/sonner";
import "../src/app/globals.css";

const preview: Preview = {
  loaders: [
    mswLoader(async () => {
      const worker = setupWorker();
      await worker.start({ onUnhandledRequest: "bypass" });
      return worker;
    }),
  ],
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

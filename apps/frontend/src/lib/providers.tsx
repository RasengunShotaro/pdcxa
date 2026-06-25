"use client";
import { jaJP } from "@clerk/localizations";
import { ClerkProvider } from "@clerk/nextjs";
import { shadcn } from "@clerk/themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { AUTH_MOCKING } from "@/lib/auth/mocking";
import { MswProvider } from "@/lib/msw-provider";

const makeQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: 1000 * 60 * 5,
        staleTime: 1000 * 60 * 5,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: false,
      },
    },
  });
};

let browserQueryClient: QueryClient | undefined;

const getQueryClient = () => {
  if (typeof window === "undefined") {
    return makeQueryClient();
  }
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
};

export function Providers({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient();

  const tree = (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        disableTransitionOnChange
        enableSystem
        themes={["light", "dark", "legacy"]}
      >
        <Toaster position="top-center" />
        <MswProvider>{children}</MswProvider>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );

  if (AUTH_MOCKING) {
    return tree;
  }

  return (
    <ClerkProvider
      appearance={{
        baseTheme: shadcn,
      }}
      localization={jaJP}
    >
      {tree}
    </ClerkProvider>
  );
}

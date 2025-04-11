"use client";
import { ClerkProvider } from "@clerk/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { type ReactNode, useState } from "react";
import { jaJP } from "@clerk/localizations";
import { dark } from '@clerk/themes'

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
          },
        },
      })
  );

  return (
    <ClerkProvider localization={jaJP} 
    appearance={{
      baseTheme: dark,
    }}>
      <SessionProvider>
        <QueryClientProvider client={queryClient}>
          {children}
          {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        </QueryClientProvider>
      </SessionProvider>
    </ClerkProvider>
  );
}

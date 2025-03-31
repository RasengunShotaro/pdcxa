import { Providers } from "@/lib/providers";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ChatApp",
  description: "Twitterのような非同期チャットアプリケーション",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient();
  const dehydratedState = dehydrate(queryClient);

  return (
    <html lang="ja">
      <body className="bg-gray-100 min-h-screen">
        <Providers>
          <HydrationBoundary state={dehydratedState}>
            {children}
          </HydrationBoundary>
        </Providers>
      </body>
    </html>
  );
}

import { AppSidebar as Sidebar } from "@/components/elements/Sidebar";
import { Header } from "@/components/elements/TopBar";
import { Providers } from "@/lib/providers";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import "./globals.css";
import { TimeLineRefetchButton } from "@/components/elements/refetch";

export const runtime = "edge";

export const metadata: Metadata = {
  title: "PDCXA",
  description: "日々のPDを記録するアプリ",
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
            <div className="h-screen bg-gray-100 ">
              <Header>
                <TimeLineRefetchButton />
              </Header>
              <div className="flex">
                <Sidebar />
                <div className="flex-1">
                  <div className="p-6">{children}</div>
                </div>
              </div>
            </div>
          </HydrationBoundary>
        </Providers>
      </body>
    </html>
  );
}

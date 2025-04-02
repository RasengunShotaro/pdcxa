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
            <div className="h-screen bg-gray-100 overflow-hidden">
              <div className="fixed top-0 left-0 right-0 z-50">
                <Header />
              </div>
              <div className="flex pt-16">
                <aside className="w-64 flex-none">
                  <div className="fixed top-16 h-[calc(100vh-64px)]">
                    <Sidebar />
                  </div>
                </aside>
                <div className="flex-1 h-[calc(100vh-64px)] overflow-y-auto">
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

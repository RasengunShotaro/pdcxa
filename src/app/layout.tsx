import { AppSidebar } from "@/components/elements/app-sidebar";
import { Providers } from "@/lib/providers";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/elements/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

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
      <body>
        <Providers>
          <HydrationBoundary state={dehydratedState}>
            <div className="[--header-height:calc(theme(spacing.14))]">
              <SidebarProvider className="flex flex-col">
                <SiteHeader />
                <div className="flex flex-1">
                  <AppSidebar />
                  <SidebarInset>
                    <div className="flex flex-1 flex-col gap-4 p-4">
                      {children}
                    </div>
                  </SidebarInset>
                </div>
              </SidebarProvider>
            </div>
          </HydrationBoundary>
        </Providers>
      </body>
    </html>
  );
}

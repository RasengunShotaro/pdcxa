import { Providers } from "@/lib/providers";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import "./globals.css";
import { BIZ_UDPGothic } from "next/font/google";

export const runtime = "edge";

export const metadata: Metadata = {
  title: "PDCXA",
  description: "日々のPDを記録するアプリ",
};

const bizUdpGothic = BIZ_UDPGothic({
  weight: ["400", "700"],
  preload: false,
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient();
  const dehydratedState = dehydrate(queryClient);

  return (
    <html lang="ja" className={bizUdpGothic.className} suppressHydrationWarning>
      <body>
        <Providers>
          <HydrationBoundary state={dehydratedState}>
            {children}
          </HydrationBoundary>
        </Providers>
      </body>
    </html>
  );
}

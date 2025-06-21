import type { Metadata } from "next";
import { Providers } from "@/lib/providers";
import "./globals.css";
import { BIZ_UDPGothic } from "next/font/google";

export const metadata: Metadata = {
  title: "PDCXA",
  description: "日々のPDを記録するアプリ",
};

const bizUdpGothic = BIZ_UDPGothic({
  weight: ["400", "700"],
  preload: false,
  display: "swap",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={bizUdpGothic.className} lang="ja" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

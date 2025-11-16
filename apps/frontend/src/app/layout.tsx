import type { Metadata } from "next";
import { Providers } from "@/lib/providers";
import "./globals.css";
import { udShinGo } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "PDCXA",
  description: "日々のPDを記録するアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={udShinGo.className} lang="ja" suppressHydrationWarning>
      <head>
        <meta name="darkreader-lock" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

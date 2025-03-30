import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ChatApp",
  description: "Twitterのような非同期チャットアプリケーション",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="bg-gray-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}

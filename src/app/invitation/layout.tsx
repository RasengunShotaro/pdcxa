import type { Metadata } from "next";
import { metadata as rootMetadata } from "../layout";

export const runtime = "edge";

export const metadata: Metadata = {
  title: `招待 - ${rootMetadata.title}`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

import type { Metadata } from "next";
import { metadata as rootMetadata } from "../../layout";

export const metadata: Metadata = {
  title: `プロフィール - ${rootMetadata.title}`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="mx-auto w-full max-w-[37.5rem]">{children}</div>;
}

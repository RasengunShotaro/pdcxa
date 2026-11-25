import { SinglePane } from "@/components/elements/feed-layout";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SinglePane>{children}</SinglePane>;
}

import { TimelineLayout } from "@/feature/pd/components/timeline/timeline-layout";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <TimelineLayout>{children}</TimelineLayout>;
}
